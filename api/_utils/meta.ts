import fetch from 'node-fetch';

export const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = process.env.META_API_VERSION || 'v19.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export async function metaFetch(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.append('access_token', ACCESS_TOKEN || '');

    Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
            if (typeof params[key] === 'object') {
                url.searchParams.append(key, JSON.stringify(params[key]));
            } else {
                url.searchParams.append(key, String(params[key]));
            }
        }
    });

    const response = await fetch(url.toString());
    const data: any = await response.json();

    if (!response.ok) {
        console.error('[Meta API Error]', JSON.stringify(data.error));
        throw {
            status: response.status,
            message: data.error?.message || 'Erro desconhecido na Meta API',
            code: data.error?.code
        };
    }

    return data;
}
