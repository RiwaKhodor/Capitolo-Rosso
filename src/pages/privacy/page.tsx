import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Privacy() {
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
            {t('privacy.title')}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-12"></div>

          <div className="relative bg-[#5A0A06] p-8 rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden space-y-8 text-[#F5E6D3]">
            {/* Top-left corner border */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
            
            {/* Bottom-right corner border */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>
            
            <div className="text-sm leading-relaxed mb-4">
              <p>
                {t('privacy.intro')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.responsible.title')}
              </h2>
              <div className="text-sm leading-relaxed space-y-2">
                <p>
                  <strong>Capitolo Rosso</strong><br />
                  {t('privacy.responsible.owner')} Khodor Hamadeh<br />
                  Choriner Straße 72<br />
                  10119 Berlin<br />
                  Deutschland
                </p>
                <p>
                  {t('privacy.responsible.phone')} <a href="tel:+493055232260" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">+49 (0)30 55232260</a><br />
                  {t('privacy.responsible.email')} <a href="mailto:info@capitolo-rosso.de" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">info@capitolo-rosso.de</a><br />
                  {t('privacy.responsible.website')} <a href="https://www.capitolo-rosso.de" target="_blank" rel="noopener noreferrer" className="text-[#C7A454] hover:text-[#D4AF37] transition-colors">https://www.capitolo-rosso.de</a>
                </p>
              </div>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.social.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.social.text')}
              </p>
              <ul className="list-disc list-inside text-sm leading-relaxed mt-3 space-y-1">
                <li>Instagram (Meta Platforms Ireland Ltd.)</li>
                <li>Facebook (Meta Platforms Ireland Ltd.)</li>
                <li>Google Unternehmensprofil (Google Ireland Limited)</li>
              </ul>
              <p className="text-sm leading-relaxed mt-3">
                <strong>{t('privacy.social.legal')}</strong> {t('privacy.social.legal.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.instagram.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.instagram.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.facebook.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.facebook.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.google.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.google.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.embedding.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.embedding.text')}
                <br />
                <strong>{t('privacy.embedding.legal')}</strong> {t('privacy.embedding.legal.text')}
              </p>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.rights.title')}
              </h2>
              <p className="text-sm leading-relaxed mb-3">
                {t('privacy.rights.intro')}
              </p>
              <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
                <li>{t('privacy.rights.info')}</li>
                <li>{t('privacy.rights.correction')}</li>
                <li>{t('privacy.rights.deletion')}</li>
                <li>{t('privacy.rights.restriction')}</li>
                <li>{t('privacy.rights.objection')}</li>
                <li>{t('privacy.rights.complaint')}</li>
              </ul>
            </div>

            <div className="border-t border-[#C7A454]/30 pt-6">
              <h2 className="text-2xl font-serif text-[#C7A454] mb-4">
                {t('privacy.current.title')}
              </h2>
              <p className="text-sm leading-relaxed">
                {t('privacy.current.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
