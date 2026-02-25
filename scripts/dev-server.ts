import express from 'express';
import { loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

/**
 * DEV-SERVER VILLA MED
 * Este servidor emula as Vercel Serverless Functions localmente.
 * 
 * MOTIVAÇÃO DA MUDANÇA:
 * O Express 5.x e versões recentes do path-to-regexp não aceitam mais '*' ou '(.*)' 
 * sem parâmetros nomeados em strings de rota, causando PathError.
 * Usamos app.use('/api', ...) para interceptar o prefixo sem disparar o roteador complexo.
 */

console.log('\x1b[33m%s\x1b[0m', '>> Iniciando Servidor de API (Villamed Dev)...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente do .env local
const env = loadEnv('development', process.cwd(), '');
Object.assign(process.env, env);

const app = express();
const PORT = 3001;

app.use(express.json());

// Helper para emular o comportamento da Vercel
const handleVercelRequest = async (req: express.Request, res: express.Response) => {
    /**
     * CORREÇÃO DE PATH:
     * 1. Usamos req.originalUrl para capturar a URL completa vinda do proxy.
     * 2. Removemos a QueryString (e.g. ?since=...) para isolar o caminho do arquivo.
     * 3. Removemos o prefixo '/api/' para mapear para a pasta local.
     */
    const urlWithoutQuery = req.originalUrl.split('?')[0];
    const cleanPath = urlWithoutQuery.replace(/^\/api\//, '').replace(/\/$/, '');

    if (!cleanPath) {
        return res.status(404).send('Servidor de API local. Informe uma rota válida.');
    }

    const candidateBasePath = path.join(process.cwd(), 'api', cleanPath);

    // Procura arquivos .ts primeiro, depois .js (prioridade TypeScript)
    const tsPath = candidateBasePath.endsWith('.ts') ? candidateBasePath : candidateBasePath + '.ts';
    const jsPath = candidateBasePath.endsWith('.js') ? candidateBasePath : candidateBasePath + '.js';

    let finalPath = '';
    if (fs.existsSync(tsPath)) finalPath = tsPath;
    else if (fs.existsSync(jsPath)) finalPath = jsPath;

    if (!finalPath) {
        console.warn(`\x1b[31m[404]\x1b[0m Função não encontrada para: /api/${cleanPath}`);
        return res.status(404).json({
            error: 'Not Found',
            message: `O arquivo da função não foi encontrado em: api/${cleanPath}.ts`
        });
    }

    try {
        // No Windows, o import dinâmico exige o protocolo file:// e barras normais (/).
        // Adicionamos um timestamp (?update=) para evitar cache de import durante o dev.
        const fileUrl = 'file://' + finalPath.replace(/\\/g, '/') + '?update=' + Date.now();
        const module = await import(fileUrl);
        const handler = module.default;

        if (typeof handler === 'function') {
            console.log(`\x1b[36m[API Exec]\x1b[0m Executando /api/${cleanPath}`);
            await handler(req, res);
        } else {
            console.error(`\x1b[31m[Handler Error]\x1b[0m O arquivo api/${cleanPath} não exporta uma função default.`);
            res.status(500).send('O arquivo não exporta um handler default.');
        }
    } catch (err: any) {
        console.error(`\x1b[31m[Critical Execution Error]\x1b[0m /api/${cleanPath}:`, err);
        res.status(500).json({ error: 'Erro interno na função', details: err.message });
    }
};

/**
 * 1) REMOVIDO: app.all('/api/*', ...) que causava PathError.
 * 2) SUBSTITUÍDO: app.use('/api', ...) intercepta o prefixo de forma segura.
 */
app.use('/api', (req, res) => {
    handleVercelRequest(req, res);
});

// Fallback para rotas fora de /api (porta 3001 direta)
app.use((req, res) => {
    res.status(404).send('API local operando na porta 3001. Use prefixo /api/.');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m[Backend Dev]\x1b[0m Servidor rodando em http://localhost:${PORT}`);
    console.log(`\x1b[32m[Backend Dev]\x1b[0m Pronto para processar requisições /api/* encaminhadas pelo Vite.`);
});
