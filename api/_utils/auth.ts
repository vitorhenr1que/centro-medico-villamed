import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

export default function validateRequest(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-key'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return false;
    }

    const clientKey = req.headers['x-admin-key'];

    if (!clientKey || clientKey !== ADMIN_API_KEY) {
        res.status(401).json({ error: 'Não autorizado. Chave de API inválida ou ausente.' });
        return false;
    }

    return true;
}
