import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CTA() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-[#410704] relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 object-top"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=Elegant%20Italian%20restaurant%20table%20setting%20with%20wine%20glasses%20candles%20and%20fresh%20flowers%20creating%20romantic%20ambiance%20with%20warm%20lighting%20and%20rustic%20wooden%20table%20on%20soft%20blurred%20background&width=1920&height=800&seq=cta-bg-001&orientation=landscape)'
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-6">
          {t('cta.title')}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
        <p className="text-base text-[#F5E6D3]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => {
              navigate('/reservations');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="px-10 py-4 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:bg-[#F5E6D3] hover:text-[#410704] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap cursor-pointer text-sm"
          >
            {t('cta.reserve')}
          </button>
          <button
            onClick={() => {
              navigate('/contact');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="px-10 py-4 bg-transparent border-2 border-[#F5E6D3] text-[#F5E6D3] font-semibold rounded-md hover:bg-[#F5E6D3] hover:text-[#410704] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap cursor-pointer text-sm"
          >
            {t('cta.contact')}
          </button>
        </div>
      </div>
    </section>
  );
}
