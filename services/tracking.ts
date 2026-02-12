
import { META_PIXEL_ID, EVENT_CLICK_WHATSAPP } from '../constants';

// Flags em memória para evitar múltiplos disparos de eventos de scroll
let firedScroll50 = false;
let firedScroll75 = false;

/**
 * Inicializa o Meta Pixel dinamicamente e dispara PageView
 * Requisito: Meta Pixel Base
 */
export const initPixel = () => {
  if (typeof window === 'undefined') return;

  // Verifica se o placeholder ainda está presente para evitar erros de console
  if (META_PIXEL_ID.includes('{{')) {
    console.warn('[Meta Pixel] ID não configurado. Substitua o placeholder {{META_PIXEL_ID}} no arquivo constants.tsx');
    return;
  }

  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Inicializa o Pixel
  window.fbq('init', META_PIXEL_ID);

  // Evento PageView (Obrigatório ao carregar)
  window.fbq('track', 'PageView');
};

/**
 * Dispara eventos personalizados (trackCustom)
 */
export const trackEvent = (eventName: string, params?: object) => {
  if (window.fbq) {
    window.fbq('trackCustom', eventName, params);
    console.log(`[Meta Ads] Evento Customizado: ${eventName}`, params);
  }
};

/**
 * Dispara eventos padrão (track)
 */
export const trackStandard = (eventName: string, params?: object) => {
  if (window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Meta Ads] Evento Padrão: ${eventName}`, params);
  }
};

/**
 * Monitora o scroll do usuário e dispara eventos em 50% e 75%
 * Dispara apenas uma vez por sessão de carregamento
 */
export const setupScrollTracking = () => {
  const handleScroll = () => {
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    // Cálculo do percentual de scroll
    const scrollPercentage = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

    if (!firedScroll50 && scrollPercentage >= 50) {
      trackEvent('Scroll50');
      firedScroll50 = true;
    }

    if (!firedScroll75 && scrollPercentage >= 75) {
      trackEvent('Scroll75');
      firedScroll75 = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// Map para controlar disparos únicos por rota usando TTL (Time To Live)
// Chave: pathname -> Valor: timestamp do último disparo
const lastLeadTimeByPath: Record<string, number> = {};
const SPAM_BLOCK_TTL_MS = 30 * 1000; // 30 segundos de bloqueio por rota

/**
 * Gera um CAPI Event ID único (UUID v4-like)
 * Utilizado para deduplicação entre Pixel (Browser) e Conversions API (Server)
 */
const generateEventId = (): string => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `eventId-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Envia o evento para a Conversions API (Server-Side)
 * Usa sendBeacon para garantir envio mesmo se a página fechar (comum em redirects mobile)
 */
const sendToCAPI = async (eventName: string, eventId: string, customData?: object, standardData?: object) => {
  try {
    const payload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId, // ID vital para deduplicação (mesmo ID do Pixel)
      event_source_url: window.location.href,
      user_data: {
        client_user_agent: navigator.userAgent
        // IP é capturado no backend
      },
      custom_data: { ...customData, ...(standardData || {}) },
      // VALUE/CURRENCY: Inativos nesta fase inicial
    };

    const body = JSON.stringify(payload);
    const url = '/api/meta-conversion';

    // 1. Tenta usar Beacon API (Ideal para "clicou e saiu")
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon(url, blob);
      if (queued) {
        console.log(`[Meta CAPI] Queued via Beacon: ${eventName}`);
        return;
      }
    }

    // 2. Fallback para Fetch com keepalive
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true
    }).catch(err => console.error('[Meta CAPI] Fetch error:', err));

  } catch (err) {
    console.error('[Meta CAPI] Erro ao preparar envio:', err);
  }
};

/**
 * Listener global para capturar cliques em interações do WhatsApp
 * Lógica Híbrida de Produção (Ajustes Finais):
 * - IDs Separados: UM ID para click, OUTRO ID para lead (para evitar colisão de deduplicação)
 * - Anti-duplicidade TTL: Bloqueia cliques repetidos por 30s na mesma rota
 */
export const setupWhatsAppTracking = () => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const waElement = target.closest('a[href*="wa.me"], a[href*="whatsapp"], [data-whatsapp="true"]');

    if (!waElement) return;

    const path = window.location.pathname;
    const now = Date.now();
    const lastFired = lastLeadTimeByPath[path] || 0;

    // Proteção TTL: Se clicou há menos de 30s na mesma rota, ignora
    if (now - lastFired < SPAM_BLOCK_TTL_MS) {
      console.log(`[Meta Tracking] Clique repetido em ${path} bloqueado pelo TTL.`);
      return;
    }

    const dataset = (waElement as HTMLElement).dataset || {};
    const location = dataset.location || 'unknown';
    const cta = dataset.cta || waElement.textContent?.trim() || 'WhatsApp Button';

    // Gera Event ID ÚNICO para cada evento distinto
    // IMPORTANTE: Não usar o mesmo ID para eventos diferentes, pois a Meta pode confundir a deduplicação
    const eventIdClick = generateEventId();
    const eventIdLead = generateEventId();

    // --- 1. Evento Customizado (ClickWhatsApp) ---
    const customParams = { location, cta, page_path: path };

    // Pixel (Browser)
    if (window.fbq) {
      window.fbq('trackCustom', EVENT_CLICK_WHATSAPP, customParams, { eventID: eventIdClick });
    }
    // CAPI (Server)
    sendToCAPI(EVENT_CLICK_WHATSAPP, eventIdClick, customParams);

    // --- 2. Evento Padrão (Lead) ---
    // Value e Currency removidos para evitar distorção
    const leadParams = {
      content_name: cta,
      content_category: 'WhatsApp Contact',
      content_ids: [`wa_${location}`]
    };

    // Pixel (Browser)
    if (window.fbq) {
      window.fbq('track', 'Lead', leadParams, { eventID: eventIdLead });
    }
    // CAPI (Server)
    sendToCAPI('Lead', eventIdLead, undefined, leadParams);

    // Atualiza timestamp do último disparo
    lastLeadTimeByPath[path] = now;
    console.log(`[Meta Hybrid] Lead Registrado (TTL reset).`);
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
};
