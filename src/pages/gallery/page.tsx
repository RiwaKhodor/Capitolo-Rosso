import { useState, useEffect, useRef } from 'react';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Gallery() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // Check if already in viewport and trigger animation
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        // Small delay to ensure animation plays
        setTimeout(() => setHeroVisible(true), 100);
      }
    };

    checkVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    Object.keys(sectionRefs.current).forEach((key) => {
      // For culinary section, trigger when top appears (threshold: 0)
      // For other sections, use threshold: 0.2
      const threshold = key === 'culinary' ? 0 : 0.2;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleSections((prev) => ({
            ...prev,
            [key]: entry.isIntersecting,
          }));
        },
        { threshold, rootMargin: key === 'culinary' ? '0px' : '0px' }
      );

      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]!);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#410704]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 flex items-center justify-center overflow-hidden min-h-[500px]">
        {/* Elegant Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: 'url(/interior/DSC04026.jpeg)'
          }}
        ></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar scrolled={scrolled} />
        </div>

        {/* Content */}
        <div ref={heroRef} className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('gallery.hero.subtitle')}
            </span>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-[#F5E6D3] mb-6">
            {t('gallery.hero.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
          
          <p className="text-base md:text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed px-4 md:px-0 break-words">
            {t('gallery.hero.description')}
          </p>
        </div>
      </section>

      {/* Interior & Ambiance Section */}
      <section 
        ref={(el) => { sectionRefs.current['interior'] = el; }}
        className="py-24 px-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4 transition-all duration-1000 ${visibleSections['interior'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.interior.title')}
            </h2>
            <p className={`text-base text-[#C7A454] transition-all duration-1000 delay-200 ${visibleSections['interior'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.interior.description')}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Large Image Left */}
            <div className={`col-span-12 md:col-span-7 transition-all duration-1000 ${visibleSections['interior'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[600px] md:aspect-auto">
                <img 
                  src="/interior/DSC04042%281%29.jpeg" 
                  alt="Restaurant Interior" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Two Stacked Images Right */}
            <div className="col-span-12 md:col-span-5 space-y-6">
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[290px] md:aspect-auto transition-all duration-1000 delay-300 ${visibleSections['interior'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                <img 
                  src="/interior/DSC04026.jpeg" 
                  alt="Table Setting" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[290px] md:aspect-auto transition-all duration-1000 delay-500 ${visibleSections['interior'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                <img 
                  src="/interior/image.png" 
                  alt="Wine Display" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Creations Section */}
      <section 
        ref={(el) => { sectionRefs.current['culinary'] = el; }}
        className="py-24 px-6 relative overflow-hidden bg-[#5A0A06]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4 transition-all duration-1000 ${visibleSections['culinary'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.culinary.title')}
            </h2>
            <p className={`text-base text-[#C7A454] transition-all duration-1000 delay-200 ${visibleSections['culinary'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.culinary.description')}
            </p>
          </div>

          {/* Use all real photos from public/gallery */}
          <div className="grid grid-cols-12 gap-6">
            {[
              '/gallery/DSC03760.jpeg',
              '/gallery/DSC04185.jpeg',
              '/gallery/DSC03924.jpeg',
              '/gallery/DSC04110.jpeg',
              '/gallery/DSC03798.jpeg',
              '/gallery/DSC03927.jpeg',
              '/gallery/DSC04169.jpeg',
              '/gallery/DSC03816.jpeg',
              '/gallery/DSC03941.jpeg',
              '/gallery/DSC04190.jpeg',
              '/gallery/DSC03717.jpeg',
              '/gallery/DSC04211.jpeg',
            ].map((src) => (
              <div
                key={src}
                className={`col-span-12 sm:col-span-6 md:col-span-4 transition-opacity duration-500 ${
                  visibleSections['culinary']
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[350px] md:aspect-auto">
                  <img
                    src={src}
                    alt="Culinary creation"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-line text-2xl"></i>
        </button>
      )}
    </div>
  );
}
