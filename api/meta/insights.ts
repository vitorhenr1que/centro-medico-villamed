import type { VercelRequest, VercelResponse } from '@vercel/node';
import validateRequest from '../_utils/auth.js';
import { metaFetch, AD_ACCOUNT_ID } from '../_utils/meta.js';
import * as cache from '../_utils/cache.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!validateRequest(req, res)) return;

    const {
        since,
        until,
        level = 'campaign',
        time_increment,
        customConversionIds,
        q // filtro de nome (contains)
    } = req.query;

    // Cache key baseada nos parâmetros
    const cacheKey = `insights_${since}_${until}_${level}_${time_increment}_${customConversionIds}_${q}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    try {
        // 1. Buscar Custom Conversions para mapear IDs em Nomes
        const convData = await metaFetch(`act_${AD_ACCOUNT_ID}/customconversions`, { fields: 'id,name' });
        const convMap: Record<string, string> = {};
        if (convData.data) {
            convData.data.forEach((c: any) => convMap[c.id] = c.name);
        }

        // 2. Preparar filtros de data
        const time_range = {
            'since': since || getYesterdaysDate(7),
            'until': until || getYesterdaysDate(0)
        };

        // 3. Buscar Insights
        let insightsData = await metaFetch(`act_${AD_ACCOUNT_ID}/insights`, {
            level,
            time_range,
            time_increment,
            fields: 'campaign_id,campaign_name,spend,impressions,reach,frequency,clicks,ctr,cpc,actions,action_values,date_start,date_stop',
            limit: 100
        });

        // 4. Processar campanhas
        let rawData = insightsData.data || [];

        let campaigns = rawData.map((item: any) => {
            const spend = parseFloat(item.spend || 0);
            const reach = parseInt(item.reach || 0);
            const impressions = parseInt(item.impressions || 0);
            const frequency = parseFloat(item.frequency || 0);
            const conversions: Record<string, number> = {};
            const cpa: Record<string, number> = {};

            if (item.actions) {
                item.actions.forEach((action: any) => {
                    if (action.action_type.startsWith('offsite_conversion.custom.')) {
                        const id = action.action_type.split('.').pop();
                        const name = convMap[id] || id;

                        // Se houver filtro de IDs, aplicar
                        if (customConversionIds && !String(customConversionIds).split(',').includes(id)) return;

                        conversions[name] = (conversions[name] || 0) + parseInt(action.value || 0);
                    }
                });
            }

            // Calcular CPA
            Object.keys(conversions).forEach(name => {
                cpa[name] = conversions[name] > 0 ? (spend / conversions[name]) : 0;
            });

            return {
                campaign_id: item.campaign_id,
                campaign_name: item.campaign_name,
                spend,
                impressions,
                reach,
                frequency,
                clicks: parseInt(item.clicks || 0),
                ctr: parseFloat(item.ctr || 0),
                cpc: parseFloat(item.cpc || 0),
                conversions,
                cpa,
                date_start: item.date_start,
                date_stop: item.date_stop
            };
        });

        // Filtrar por nome (opcional)
        if (q) {
            const query = String(q).toLowerCase();
            campaigns = campaigns.filter((c: any) => c.campaign_name.toLowerCase().includes(query));
        }

        // Calcular Totais
        const totals = campaigns.reduce((acc: any, curr: any) => {
            acc.spend += curr.spend;
            acc.impressions += curr.impressions;
            acc.reach += curr.reach;
            Object.keys(curr.conversions).forEach(name => {
                acc.conversions[name] = (acc.conversions[name] || 0) + curr.conversions[name];
            });
            return acc;
        }, { spend: 0, impressions: 0, reach: 0, conversions: {}, cpa: {}, frequency: 0 });

        // Calcular Frequência Total e CPA Total
        totals.frequency = totals.reach > 0 ? (totals.impressions / totals.reach) : 0;

        Object.keys(totals.conversions).forEach(name => {
            totals.cpa[name] = totals.conversions[name] > 0 ? (totals.spend / totals.conversions[name]) : 0;
        });

        const result = {
            range: { since: time_range.since, until: time_range.until },
            level,
            totals,
            campaigns
        };

        cache.set(cacheKey, result, 600); // 10 minutos de cache
        res.status(200).json(result);

    } catch (error: any) {
        res.status(error.status || 500).json(error);
    }
}

function getYesterdaysDate(daysAgo: number) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}
