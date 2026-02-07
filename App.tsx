import React, { useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Star,
  Instagram,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Map
} from 'lucide-react';
import {
  initPixel,
  setupScrollTracking,
  setupWhatsAppTracking
} from './services/tracking';
import WhatsAppButton from './components/WhatsAppButton';
import Services from './components/Services';
import {
  BENEFITS,
  TESTIMONIALS,
  ADDRESS,
  PHONE,
  INSTAGRAM_LINK,
  WHATSAPP_LINK
} from './constants';
const App: React.FC = () => {
  useEffect(() => {
    // 1) Inicializa o Meta Pixel e dispara PageView
    initPixel();

    // 2) Inicializa o rastreamento de scroll (50% e 75%)
    const cleanupScroll = setupScrollTracking();

    // 3) Inicializa o rastreamento global de cliques no WhatsApp
    const cleanupWhatsApp = setupWhatsAppTracking();

    // Limpeza dos listeners ao desmontar o componente
    return () => {
      cleanupScroll();
      cleanupWhatsApp();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brandLight font-sans text-gray-800">

      {/* 1️⃣ HEADER / NAV */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/images/villa-med-logo.png"
              alt="VillaMed Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="hidden lg:flex gap-8 font-medium text-brandDark">
            <a href="#servicos" className="hover:text-secondary transition-colors">Serviços</a>
            <a href="#sobre" className="hover:text-secondary transition-colors">Diferenciais</a>
            <a href="#depoimentos" className="hover:text-secondary transition-colors">Avaliações</a>
            <a href="#localizacao" className="hover:text-secondary transition-colors">Localização</a>
          </div>
          <div className="flex gap-2">
            <WhatsAppButton
              label="Agendar Agora"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
              link={WHATSAPP_LINK}
              trackingLabel="Header-Geral"
            />
          </div>
        </div>
      </header>

      {/* 1️⃣ HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwep-rQ84yFj5Si_8NR4l4eiEXrCgWsFPFmwa7sA7_mAMxFnVGrFrnhqkbfXdR9-eJG1EXx_I8CfFNtzMWeb-mBexf25VdNQGsMqT5OVzMJywJMUBzcqdsgNiUdSkfqlrY0iouWJIsQ=s680-w680-h510-rw"
            alt="Fachada do Centro Médico VillaMed"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brandLight via-brandLight/90 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-2xl text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-secondary rounded-full font-semibold text-sm backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Atendimento Humanizado | Especialistas Qualificados
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-brandDark leading-tight">
              Cuidado médico de <span className="text-secondary italic">excelência</span> em um só lugar.
            </h1>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              No Centro Médico VillaMed, unimos consultas com especialistas e exames laboratoriais em um ambiente acolhedor e moderno.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <WhatsAppButton
                label="Agendar pelo WhatsApp"
                size="lg"
                variant="primary"
                link={WHATSAPP_LINK}
                trackingLabel="Hero-Geral"
              />
            </div>

            <div className="pt-4 flex flex-wrap justify-center md:justify-start items-center gap-6 opacity-80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">+10k Pacientes Atendidos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">Referência na Região</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ SERVIÇOS */}
      <Services />

      {/* 3️⃣ SEÇÃO: POR QUE ESCOLHER A VILLAMED */}
      <section id="sobre" className="py-20 bg-brandLight">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <img
                src="/images/faixada.png"
                alt="Ambiente confortável da clínica VillaMed"
                className="rounded-3xl shadow-xl w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brandDark">
                Por que escolher o <span className="text-secondary">Centro Médico VillaMed?</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Focamos no que realmente importa: você. Nossa estrutura foi pensada para oferecer conforto e agilidade desde a recepção até o diagnóstico final.
              </p>
              <div className="space-y-6">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white text-secondary rounded-2xl shadow-sm flex items-center justify-center border border-primary/20">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-brandDark mb-1">{benefit.title}</h4>
                      <p className="text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ PROVA SOCIAL */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brandDark mb-4">
              O que nossos pacientes dizem
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <div className="flex justify-center items-center gap-1 text-yellow-500">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <span className="text-gray-600 font-bold ml-2">4.9/5 nas avaliações</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-brandLight p-8 rounded-3xl border border-primary/10 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                </div>
                <p className="text-gray-600 italic mb-6">"{t.text}"</p>
                <div className="w-full h-px bg-primary/20 mb-4"></div>
                <h4 className="font-heading font-bold text-brandDark">{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5️⃣ LOCALIZAÇÃO */}
      <section id="localizacao" className="py-20 bg-brandLight">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-primary/10">
            <div className="flex flex-col lg:flex-row">
              {/* Info Side */}
              <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-secondary rounded-full font-bold text-xs uppercase tracking-wider mb-6">
                  <MapPin className="w-3 h-3" />
                  Onde Estamos
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-brandDark mb-6 leading-tight">
                  Venha nos <span className="text-secondary">visitar</span>
                </h2>

                <div className="space-y-8">
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-brandLight text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-brandDark mb-1 text-lg">Nosso Endereço</h4>
                      <p className="text-gray-600 leading-relaxed">{ADDRESS}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-brandLight text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-brandDark mb-1 text-lg">Telefone e WhatsApp</h4>
                      <p className="text-gray-600 leading-relaxed font-medium">{PHONE}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-brandLight text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-brandDark mb-1 text-lg">Horário de Atendimento</h4>
                      <p className="text-gray-600 leading-relaxed">Segunda a Sexta: 07h às 18h<br />Sábado: 07h às 12h</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <a
                    href="https://www.google.com/maps/search/Rua+Conselheiro+Ferraz,+39,+Centro,+Valença+-+BA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-brandDark font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                  >
                    <Map className="w-5 h-5" />
                    Ver no Google Maps
                  </a>
                </div>
              </div>

              {/* Map Side */}
              <div className="lg:w-1/2 min-h-[400px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.6314695807882!2d-39.07567982523089!3d-13.373176486980347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x73e440a4892e79b%3A0x78323acc7b8ea8cd!2sR.%20Conselheiro%20Ferraz%2C%2039%20-%20Centro%2C%20Valen%C3%A7a%20-%20BA%2C%2045400-000%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1770489894094!5m2!1spt-BR!2sus"
                  className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps - VillaMed"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ CTA FINAL */}
      <section className="py-20 md:py-32 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            Cuide da sua saúde com quem entende de você.
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Não deixe sua saúde para depois. Agende hoje mesmo seu atendimento com total agilidade e carinho.
          </p>
          <div className="flex justify-center">
            <WhatsAppButton
              label="Falar agora no WhatsApp"
              size="lg"
              variant="primary"
              className="!bg-primary !text-brandDark"
              link={WHATSAPP_LINK}
              trackingLabel="Final-Geral"
              data-whatsapp="true"
            />
          </div>
          <div className="mt-12 flex justify-center items-center gap-4 text-sm opacity-75">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Seguro</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> +10.000 pacientes</span>
          </div>
        </div>
      </section>

      {/* 6️⃣ RODAPÉ */}
      <footer className="bg-brandDark text-brandLight py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <img
                  src="/images/villa-med-logo-white.png"
                  alt="VillaMed Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="max-w-md opacity-80">
                O Centro Médico VillaMed é referência em atendimento humanizado e diagnóstico preciso. Nossa missão é promover saúde com ética, respeito e tecnologia.
              </p>
              <div className="flex gap-4">
                <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors" title="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-heading font-bold text-lg border-b border-primary/20 pb-2">Links Rápidos</h4>
              <ul className="space-y-3 opacity-80">
                <li><a href="#servicos" className="hover:text-primary transition-colors">Nossos Serviços</a></li>
                <li><a href="#sobre" className="hover:text-primary transition-colors">Nossos Diferenciais</a></li>
                <li><a href="#depoimentos" className="hover:text-primary transition-colors">Avaliações de Clientes</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-heading font-bold text-lg border-b border-primary/20 pb-2">Contato</h4>
              <ul className="space-y-4 opacity-80">
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{ADDRESS}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{PHONE}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center text-sm opacity-50">
            <p>&copy; {new Date().getFullYear()} Centro Médico VillaMed. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botão flutuante único para mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <WhatsAppButton
          label=""
          className="!p-4 !rounded-full aspect-square"
          variant="primary"
          link={WHATSAPP_LINK}
          trackingLabel="Floating-Geral"
          data-whatsapp="true"
        />
      </div>

    </div>
  );
}

export default App;
