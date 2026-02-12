import type { VercelRequest, VercelResponse } from '@vercel/node';

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { event_name, event_time, event_id, event_source_url, user_data, custom_data } = req.body;

        // Fallback de User-Agent: Usa o do payload (frontend) ou o do header (backend)
        const clientUserAgent = user_data?.client_user_agent || req.headers['user-agent'];

        // Validação de campos obrigatórios
        if (!event_name || !event_time || !event_id || !clientUserAgent) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!PIXEL_ID || !ACCESS_TOKEN) {
            console.error('Meta Pixel ID or Access Token not configured');
            return res.status(500).json({ error: 'Server Configuration Error' });
        }

        // Extração segura do IP do cliente (suporte a proxies/Vercel)
        const forwarded = req.headers['x-forwarded-for'];
        const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

        const payload = {
            data: [
                {
                    event_name,
                    event_time,
                    event_id,
                    event_source_url,
                    action_source: "website",
                    user_data: {
                        client_ip_address: clientIp,
                        client_user_agent: clientUserAgent,
                        // fbc e fbp podem ser adicionados aqui futuramente se extraídos de cookies
                    },
                    custom_data
                }
            ]
        };

        const response = await fetch(
            `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Meta CAPI Error:', JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        // Sucesso - log mínimo em produção
        console.log(`[Meta CAPI] Success: ${event_name} (ID: ${event_id})`);
        return res.status(200).json({ success: true, id: event_id });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
