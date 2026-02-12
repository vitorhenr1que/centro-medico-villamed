
import React from 'react';
import {
  HeartPulse,
  Stethoscope,
  UserCheck,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Benefit, Testimonial } from './types';

// CONFIGURATIONS
export const WHATSAPP_NUMBER = "5575991086388";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+ou+exame+na+VillaMed.`;

// Links específicos para segmentação de leads
export const WHATSAPP_LINK_CONSULTA = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!+Gostaria+de+agendar+uma+CONSULTA+na+VillaMed.`;
export const WHATSAPP_LINK_EXAME = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!+Gostaria+de+agendar+um+EXAME+na+VillaMed.`;

export const ADDRESS = "Rua Conselheiro Ferraz, 39 (Vila Dolinda), Centro - Valença/BA";
export const PHONE = "(75) 99108-6388";
export const INSTAGRAM_LINK = "https://instagram.com/centromedicovillamed";

// TRACKING CONSTANTS (PLACEHOLDERS OBRIGATÓRIOS)
// Substitua {{META_PIXEL_ID}} pelo ID real do seu Pixel (ex: 123456789)
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
export const EVENT_CLICK_WHATSAPP = "ClickWhatsApp";
export const EVENT_LEAD_WHATSAPP = "Lead";

export const BENEFITS: Benefit[] = [
  {
    id: 1,
    title: "Atendimento Humanizado",
    description: "Priorizamos o seu bem-estar com uma escuta ativa e acolhimento em cada etapa.",
    icon: <HeartPulse className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Profissionais Qualificados",
    description: "Corpo clínico experiente com especialistas em diversas áreas da saúde.",
    icon: <UserCheck className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Agilidade no Atendimento",
    description: "Sem filas intermináveis. Respeitamos seu tempo com horários otimizados.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Tudo em um só Lugar",
    description: "Realize sua consulta e seus exames na mesma clínica, com total praticidade.",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    id: 5,
    title: "Localização Acessível",
    description: "Fácil acesso para sua comodidade, no coração da cidade.",
    icon: <MapPin className="w-6 h-6" />,
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ana Silveira",
    text: "Atendimento excelente! Fiz meus exames e passei com a cardiologista no mesmo dia. Muito prático.",
    rating: 5,
    image: "https://picsum.photos/seed/ana/100/100",
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    text: "A VillaMed é sinônimo de confiança. Os médicos são muito atenciosos e a clínica é impecável.",
    rating: 5,
    image: "https://picsum.photos/seed/ricardo/100/100",
  },
  {
    id: 3,
    name: "Juliana Costa",
    text: "Melhor custo-benefício que já encontrei. Profissionais humanos e preço justo nos exames.",
    rating: 5,
    image: "https://picsum.photos/seed/juliana/100/100",
  }
];
