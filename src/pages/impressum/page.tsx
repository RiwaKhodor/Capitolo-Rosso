import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Impressum() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#410704]">
      <Navbar scrolled={scrolled} />
      
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-8 text-center">
            {t('impressum.title')}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-12"></div>

          <div className="relative bg-[#5A0A06] p-8 rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden space-y-8 text-[#F5E6D3]">
            {/* Top-left corner border */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
            
            {/* Bottom-right corner border */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>
            
            <div>
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('impressum.ddg.title')}
              </h2>
              
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  <strong>Capitolo Rosso</strong><br />
                  Choriner Straße 72<br />
                  Ecke Zionskirchstraße<br />
                  10119 Berlin<br />
                  Germany
                </p>
                
                <p>
                  <strong>{t('impressum.ddg.owner')}</strong><br />
                  Khodor Hamadeh
                </p>
                
                <p>
                  <strong>{t('impressum.ddg.contact')}</strong><br />
                  {t('impressum.ddg.phone')} <a href="tel:+493044058471" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">+49 (0)30 44058471</a><br />
                  {t('impressum.ddg.email')} <a href="mailto:Info@capitolo-rosso.de" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">Info@capitolo-rosso.de</a><br />
                  {t('impressum.ddg.internet')} <a href="https://www.capitolo-rosso.de" target="_blank" rel="noopener noreferrer" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">https://www.capitolo-rosso.de</a>
                </p>
              </div>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('impressum.liability.content.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('impressum.liability.content.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('impressum.liability.links.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('impressum.liability.links.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('impressum.copyright.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('impressum.copyright.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('impressum.dispute.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('impressum.dispute.text')}<br />
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-sm leading-relaxed mt-3">
                {t('impressum.dispute.notice')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
