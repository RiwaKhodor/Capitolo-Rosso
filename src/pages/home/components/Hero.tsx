import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
    <>
      <Navbar scrolled={scrolled} />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center object-top"
          style={{
            backgroundImage: 'url(https://static.readdy.ai/image/8df7d770b451dbfd4517ea3088de8db0/46f137a8276c14ea74cb5d0227c04ba6.jpeg)'
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>

        {/* Content */}
        <div ref={heroRef} className={`relative z-10 text-center px-6 max-w-5xl mx-auto w-full transition-all duration-1000 pt-16 md:pt-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex md:justify-center mb-8 animate-fade-in">
            <img 
              src="/logo.png" 
              alt="Capitolo Rosso" 
              className="h-32 md:h-40 lg:h-48 w-auto drop-shadow-2xl mx-auto"
            />
          </div>

          {/* Restaurant Name - Hidden on mobile */}
          <h1 className="hidden md:block text-6xl md:text-8xl font-serif text-[#F5E6D3] mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Capitolo Rosso
          </h1>
          
          {/* Mobile: Logo replaces text position */}
          <div className="md:hidden mb-6 animate-fade-in flex justify-center">
            <img 
              src="/logo.png" 
              alt="Capitolo Rosso" 
              className="h-32 w-auto drop-shadow-2xl"
            />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-0.5 bg-[#C7A454]"></div>
            <p className="text-xl md:text-2xl text-[#C7A454] font-light tracking-widest">
              {t('hero.tagline')}
            </p>
            <div className="w-12 h-0.5 bg-[#C7A454]"></div>
          </div>
          
          <p className="text-lg md:text-xl text-[#F5E6D3]/95 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero.description')}<br />
            {t('hero.description2')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
            <Link 
              to="/menu#hero"
              className="px-10 py-4 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:bg-[#410704] hover:text-[#F5E6D3] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap cursor-pointer text-sm"
            >
              {t('hero.viewFullMenu')}
            </Link>
            <Link 
              to="/reservations"
              className="px-10 py-4 bg-transparent border-2 border-[#F5E6D3] text-[#F5E6D3] font-semibold rounded-md hover:bg-[#F5E6D3] hover:text-[#410704] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap cursor-pointer text-sm"
            >
              {t('hero.reserveTable')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}