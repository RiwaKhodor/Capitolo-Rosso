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
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleSections((prev) => ({
            ...prev,
            [key]: entry.isIntersecting,
          }));
        },
        { threshold: 0.2 }
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
                  src="https://readdy.ai/api/search-image?query=Luxurious%20Italian%20restaurant%20interior%20with%20warm%20golden%20lighting%20elegant%20wooden%20furniture%20rich%20burgundy%20red%20walls%20sophisticated%20ambiance%20vintage%20wine%20displays%20ornate%20chandeliers%20and%20refined%20European%20dining%20atmosphere%20on%20simple%20clean%20background&width=900&height=900&seq=gallery-interior-main-001&orientation=squarish" 
                  alt="Restaurant Interior" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Two Stacked Images Right */}
            <div className="col-span-12 md:col-span-5 space-y-6">
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[290px] md:aspect-auto transition-all duration-1000 delay-300 ${visibleSections['interior'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                <img 
                  src="https://readdy.ai/api/search-image?query=Elegant%20restaurant%20table%20setting%20with%20golden%20candlelight%20warm%20burgundy%20red%20tablecloth%20fine%20dining%20silverware%20crystal%20wine%20glasses%20and%20sophisticated%20European%20ambiance%20on%20simple%20clean%20background&width=700&height=500&seq=gallery-interior-table-002&orientation=landscape" 
                  alt="Table Setting" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[290px] md:aspect-auto transition-all duration-1000 delay-500 ${visibleSections['interior'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                <img 
                  src="https://readdy.ai/api/search-image?query=Sophisticated%20wine%20cellar%20display%20with%20wooden%20racks%20golden%20lighting%20vintage%20Italian%20wine%20bottles%20elegant%20burgundy%20red%20accents%20and%20refined%20European%20atmosphere%20on%20simple%20clean%20background&width=700&height=500&seq=gallery-interior-wine-003&orientation=landscape" 
                  alt="Wine Display" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
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
              '/gallery/DSC04211.jpeg',
              '/gallery/DSC04190.jpeg',
              '/gallery/DSC04185.jpeg',
              '/gallery/DSC04169.jpeg',
              '/gallery/DSC04110.jpeg',
              '/gallery/DSC03941.jpeg',
              '/gallery/DSC03927.jpeg',
              '/gallery/DSC03924.jpeg',
              '/gallery/DSC03798.jpeg',
              '/gallery/DSC03760.jpeg',
              '/gallery/DSC03717.jpeg',
            ].map((src, index) => (
              <div
                key={src}
                className={`col-span-12 sm:col-span-6 md:col-span-4 transition-all duration-1000 ${
                  visibleSections['culinary']
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: visibleSections['culinary'] ? `${index * 80}ms` : '0ms' }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[350px] md:aspect-auto">
                  <img
                    src={src}
                    alt="Culinary creation"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Moments Section */}
      <section 
        ref={(el) => { sectionRefs.current['moments'] = el; }}
        className="py-24 px-6 relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4 transition-all duration-1000 ${visibleSections['moments'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.moments.title')}
            </h2>
            <p className={`text-base text-[#C7A454] transition-all duration-1000 delay-200 ${visibleSections['moments'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              {t('gallery.moments.description')}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Masonry Style Layout */}
            <div className={`col-span-12 md:col-span-5 transition-all duration-1000 ${visibleSections['moments'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[500px] md:aspect-auto">
                <img 
                  src="https://readdy.ai/api/search-image?query=Elegant%20Italian%20restaurant%20celebration%20event%20with%20guests%20toasting%20wine%20glasses%20warm%20golden%20lighting%20burgundy%20red%20ambiance%20joyful%20atmosphere%20and%20sophisticated%20European%20dining%20experience%20on%20simple%20clean%20background&width=700&height=900&seq=gallery-event-celebration-001&orientation=portrait" 
                  alt="Celebration Event" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 space-y-6">
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[320px] md:aspect-auto transition-all duration-1000 delay-200 ${visibleSections['moments'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <img 
                  src="https://readdy.ai/api/search-image?query=Romantic%20Italian%20restaurant%20dinner%20for%20two%20with%20candlelight%20golden%20ambiance%20burgundy%20red%20roses%20wine%20glasses%20and%20intimate%20sophisticated%20European%20dining%20atmosphere%20on%20simple%20clean%20background&width=900&height=500&seq=gallery-event-romantic-002&orientation=landscape" 
                  alt="Romantic Dinner" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[250px] md:aspect-auto transition-all duration-1000 delay-300 ${visibleSections['moments'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <img 
                    src="https://readdy.ai/api/search-image?query=Italian%20chef%20preparing%20fresh%20pasta%20with%20golden%20lighting%20burgundy%20red%20apron%20professional%20culinary%20craftsmanship%20and%20authentic%20European%20cooking%20tradition%20on%20simple%20clean%20background&width=600&height=600&seq=gallery-event-chef-003&orientation=squarish" 
                    alt="Chef at Work" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className={`relative rounded-2xl overflow-hidden shadow-2xl group aspect-square md:h-[250px] md:aspect-auto transition-all duration-1000 delay-400 ${visibleSections['moments'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <img 
                    src="https://readdy.ai/api/search-image?query=Happy%20guests%20enjoying%20Italian%20dining%20experience%20with%20wine%20glasses%20warm%20golden%20lighting%20burgundy%20red%20ambiance%20and%20sophisticated%20European%20restaurant%20atmosphere%20on%20simple%20clean%20background&width=600&height=600&seq=gallery-event-guests-004&orientation=squarish" 
                    alt="Happy Guests" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
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
