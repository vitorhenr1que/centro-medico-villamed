
import React from 'react';
import { Stethoscope, Microscope, CheckCircle2 } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { WHATSAPP_LINK_CONSULTA, WHATSAPP_LINK_EXAME } from '../constants';

const Services: React.FC = () => {
  const specialties = [
  "Angiologista",
  "Coloproctologista",
  "Cardiologista",
  "Dermatologia",
  "Escleroterapia",
  "Fisioterapia",
  "Fisioterapia Pélvica",
  "Ginecologia",
  "Neuropediatra",
  "Nutrição",
  "Ortopedia",
  "Oftalmologia",
  "Pediatria",
  "Psicologia",
  "Reumatologia",
  "Ultrassonografia",
  "Urologia"
];

 const exams = [
  "Ultrassonografia",
  "Eletrocardiograma",
  "Holter 24h",
  "MAPA 24h",
  "Preventivo",
  "Ecocardiograma",
  "Exames Admissionais",
  "Exames Laboratoriais",
];

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brandDark mb-4">
            Cuidado Completo para Você
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Da prevenção ao diagnóstico, oferecemos uma estrutura completa para cuidar da sua saúde e da sua família.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Consultas Block */}
          <div className="bg-brandLight p-8 md:p-10 rounded-3xl border border-primary/20 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full">
            <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Stethoscope className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-brandDark mb-4">
              Consultas com Especialistas
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Atendimento médico humanizado com profissionais experientes que dedicam o tempo necessário para o seu diagnóstico.
            </p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
              {specialties.map((item, index) => (
                <div key={index} className="flex items-center text-sm md:text-base text-brandDark font-medium">
                  <CheckCircle2 className="w-4 h-4 text-secondary mr-2 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-8 border-t border-primary/10">
              <WhatsAppButton 
                label="Agendar Consulta" 
                variant="primary" 
                className="w-full" 
                link={WHATSAPP_LINK_CONSULTA}
                trackingLabel="Card-Consultas"
              />
              <p className="text-center text-xs text-gray-500 mt-3 italic">
                + Especialidades disponíveis sob consulta.
              </p>
            </div>
          </div>

          {/* Exames Block */}
          <div className="bg-brandLight p-8 md:p-10 rounded-3xl border border-primary/20 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full">
            <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Microscope className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-brandDark mb-4">
              Exames Diagnósticos
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Tecnologia de ponta e agilidade na entrega de resultados. Realize seus exames com conforto e segurança.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
              {exams.map((item, index) => (
                <div key={index} className="flex items-center text-sm md:text-base text-brandDark font-medium">
                  <CheckCircle2 className="w-4 h-4 text-secondary mr-2 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-primary/10">
              <WhatsAppButton 
                label="Agendar Exame" 
                variant="secondary" 
                className="w-full" 
                link={WHATSAPP_LINK_EXAME}
                trackingLabel="Card-Exames"
              />
              <p className="text-center text-xs text-gray-500 mt-3">
                Resultados disponíveis online com rapidez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
