import { useLanguage } from '../../../contexts/LanguageContext';
import Navbar from '../../home/components/Navbar';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const el = heroRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section className="relative pt-32 pb-32 flex items-center justify-center overflow-hidden min-h-[500px]">
      {/* Elegant Background - Same as Reservations Page */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 object-top"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=Luxurious%20Italian%20restaurant%20interior%20with%20elegant%20table%20settings%20crystal%20chandeliers%20warm%20golden%20lighting%20burgundy%20velvet%20chairs%20and%20sophisticated%20ambiance%20creating%20perfect%20dining%20atmosphere%20for%20special%20occasions&width=1920&height=1000&seq=reservation-hero-bg-001&orientation=landscape)'
        }}
      ></div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Navbar scrolled={scrolled} />
      </div>

      {/* Content */}
      <div ref={heroRef} className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
            {t('contact.hero.subtitle')}
          </span>
          <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif text-[#F5E6D3] mb-6">
          {t('contact.hero.title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
        
        <p className="text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
          {t('contact.hero.description')}
        </p>
      </div>
    </section>
  );
}
