
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

  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
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

/**
 * Listener global para capturar cliques em links do WhatsApp
 * Requisito: Capturar cliques via event delegation
 */
export const setupWhatsAppTracking = () => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Encontra o link mais próximo (caso clique em ícone dentro do <a>)
    const anchor = target.closest('a');
    
    // Verifica se é um link de WhatsApp
    const isWhatsAppUrl = anchor && (
      anchor.href.includes('wa.me') || 
      anchor.href.includes('api.whatsapp.com') || 
      anchor.href.includes('whatsapp://')
    );
    
    // Verifica se possui o atributo data-whatsapp="true"
    const hasWhatsAppAttr = target.closest('[data-whatsapp="true"]');

    if (isWhatsAppUrl || hasWhatsAppAttr) {
      const label = anchor?.innerText?.trim() || target.innerText?.trim() || 'Botão WhatsApp';
      
      // Exemplo de disparo de evento ao clicar no botão:
      // trackEvent('ClickWhatsApp', { label })
      trackEvent(EVENT_CLICK_WHATSAPP, { 
        button_label: label,
        location: window.location.pathname 
      });

      // Dispara também como Lead (Conversão)
      trackStandard('Lead', { content_category: 'WhatsApp Click' });
    }
  };

  window.addEventListener('click', handleClick);
  return () => window.removeEventListener('click', handleClick);
};
