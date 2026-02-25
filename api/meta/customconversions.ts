import type { VercelRequest, VercelResponse } from '@vercel/node';
import validateRequest from '../_utils/auth.js';
import { metaFetch, AD_ACCOUNT_ID } from '../_utils/meta.js';
import * as cache from '../_utils/cache.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!validateRequest(req, res)) return;

    const cacheKey = `custom_conversions_${AD_ACCOUNT_ID}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    try {
        const data = await metaFetch(`act_${AD_ACCOUNT_ID}/customconversions`, {
            fields: 'id,name,custom_event_type'
        });

        const result = { conversions: data.data || [] };
        cache.set(cacheKey, result, 3600); // 1 hora de cache

        res.status(200).json(result);
    } catch (error: any) {
        res.status(error.status || 500).json(error);
    }
}
