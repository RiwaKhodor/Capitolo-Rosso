import { useEffect, useRef, useState } from 'react';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Reservations() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const [occasionsVisible, setOccasionsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const occasionsRef = useRef<HTMLDivElement>(null);
  const resmioWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    heroObserver.observe(heroEl);
    return () => heroObserver.unobserve(heroEl);
  }, []);

  useEffect(() => {
    const occasionsEl = occasionsRef.current;
    if (!occasionsEl) return;
    
    const occasionsObserver = new IntersectionObserver(
      ([entry]) => {
        setOccasionsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    occasionsObserver.observe(occasionsEl);
    return () => occasionsObserver.unobserve(occasionsEl);
  }, []);

  // Load Resmio widget script
  useEffect(() => {
    // Check if Resmio script is already loaded
    const existingScript = document.querySelector('script[src*="static.resmio.com"]');
    
    if (!existingScript) {
      // Load Resmio widget script exactly as provided by Resmio
      const script = document.createElement('script');
      script.src = "//static.resmio.com/static/de/widget.js#id=capitolo-rosso&height=460&width=330&fontSize=14px";
      
      // Insert script before the first script tag (as Resmio recommends)
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.body.appendChild(script);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#410704]">
      {/* Custom CSS for Resmio Widget Styling */}
      <style>{`
        /* Ensure widget container is visible and properly sized */
        #resmio-capitolo-rosso {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 100% !important;
          min-height: 460px !important;
          position: relative !important;
          background-color: #410704 !important;
        }

        /* Change white backgrounds to dark red */
        #resmio-capitolo-rosso * {
          background-color: #410704 !important;
        }

        /* Specific targeting for common white background elements */
        #resmio-capitolo-rosso div,
        #resmio-capitolo-rosso section,
        #resmio-capitolo-rosso form,
        #resmio-capitolo-rosso [class*="container"],
        #resmio-capitolo-rosso [class*="modal"],
        #resmio-capitolo-rosso [class*="widget"],
        #resmio-capitolo-rosso [class*="box"],
        #resmio-capitolo-rosso [class*="card"] {
          background-color: #410704 !important;
          background: #410704 !important;
        }

        /* Ensure iframe background is dark red */
        #resmio-capitolo-rosso iframe {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 100% !important;
          min-height: 460px !important;
          border-radius: 8px !important;
          background-color: #410704 !important;
        }

        /* Override any white or light backgrounds */
        #resmio-capitolo-rosso [style*="background-color: white"],
        #resmio-capitolo-rosso [style*="background-color: #fff"],
        #resmio-capitolo-rosso [style*="background-color: #ffffff"],
        #resmio-capitolo-rosso [style*="background: white"],
        #resmio-capitolo-rosso [style*="background: #fff"],
        #resmio-capitolo-rosso [style*="background: #ffffff"] {
          background-color: #410704 !important;
          background: #410704 !important;
        }

        /* Style input fields and selects */
        #resmio-capitolo-rosso input,
        #resmio-capitolo-rosso select,
        #resmio-capitolo-rosso textarea {
          background-color: #5A0A06 !important;
          border: 1px solid rgba(199, 164, 84, 0.3) !important;
          color: #F5E6D3 !important;
        }

        /* Text colors */
        #resmio-capitolo-rosso * {
          color: #F5E6D3 !important;
        }

        /* Buttons */
        #resmio-capitolo-rosso button {
          background: linear-gradient(to bottom, #D4AF37, #C7A454, #B8941F) !important;
          color: #410704 !important;
          border: none !important;
        }
      `}</style>
      {/* Hero Section */}
      <section id="hero" ref={sectionRef} className="relative pt-32 pb-32 flex items-center justify-center overflow-hidden min-h-[500px]">
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
        <div ref={heroRef} className={`relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('reservations.hero.subtitle')}
            </span>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-[#F5E6D3] mb-6">
            {t('reservations.hero.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
          
          <p className="text-base md:text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed px-2 md:px-0 break-words">
            {t('reservations.hero.description')}
          </p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 px-4 md:px-6 bg-[#410704]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-8">
            {t('reservations.booking.title')}
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-8 px-2">
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-[#C7A454] font-medium text-sm tracking-widest uppercase break-words text-center">
              {t('reservations.booking.subtitle')}
            </span>
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          
          {/* Resmio Integration */}
          <div className="relative bg-[#5A0A06] rounded-lg border border-[#C7A454]/20 p-4 md:p-8 overflow-hidden">
            {/* Top-left corner border */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454] z-10 pointer-events-none"></div>
            
            {/* Bottom-right corner border */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454] z-10 pointer-events-none"></div>
            
            {/* Resmio Widget Container */}
            <div 
              ref={resmioWidgetRef}
              className="w-full flex justify-center items-center min-h-[460px] relative z-0"
            >
              {/* The widget will be injected here by Resmio script */}
              <div id="resmio-capitolo-rosso" className="w-full min-h-[460px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Occasions Section */}
      <section ref={occasionsRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-6">
              {t('reservations.occasions.title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-6"></div>
            <p className="text-base text-[#F5E6D3]/80 max-w-2xl mx-auto leading-relaxed">
              {t('reservations.occasions.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Private Celebrations */}
            <div className={`group relative transition-all duration-1000 ${occasionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                    <i className="ri-cake-3-line text-3xl md:text-5xl text-[#C7A454]"></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[#F5E6D3]">
                    {t('reservations.occasions.private.title')}
                  </h3>
                </div>
                
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('reservations.occasions.private.description')}
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.private.menu')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.private.staff')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.private.decorations')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Events */}
            <div className={`group relative transition-all duration-1000 ${occasionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                    <i className="ri-briefcase-line text-3xl md:text-5xl text-[#C7A454]"></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[#F5E6D3]">
                    {t('reservations.occasions.corporate.title')}
                  </h3>
                </div>
                
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('reservations.occasions.corporate.description')}
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.corporate.atmosphere')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.corporate.seating')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.corporate.equipment')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wedding Receptions */}
            <div className={`group relative transition-all duration-1000 ${occasionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                    <i className="ri-heart-3-line text-3xl md:text-5xl text-[#C7A454]"></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[#F5E6D3]">
                    {t('reservations.occasions.wedding.title')}
                  </h3>
                </div>
                
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('reservations.occasions.wedding.description')}
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.wedding.menus')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.wedding.decoration')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="ri-check-line text-[#C7A454] text-lg mt-0.5"></i>
                    <span className="text-sm text-[#F5E6D3]/90">{t('reservations.occasions.wedding.coordination')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information - Full Width */}
      <section className="py-16 px-0 bg-[#5A0A06]">
        <div className="w-full text-center bg-[#2A0503]/60 backdrop-blur-sm p-10 shadow-lg border-y border-[#D4AF37]/20">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-8">
            {t('reservations.contact.title')}
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Phone Number */}
            <div className="text-center">
              <h4 className="text-lg font-serif text-[#F5E6D3] mb-2">
                {t('reservations.contact.phone.title')}
              </h4>
              <p className="text-sm text-[#F5E6D3]/70 mb-4">
                {t('reservations.contact.phone.description')}
              </p>
              <a 
                href="tel:+493044058471"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer text-base"
              >
                <i className="ri-phone-line text-xl"></i>
                +49 (0)30 44058471
              </a>
            </div>
            
            {/* Email Address */}
            <div className="text-center">
              <h4 className="text-lg font-serif text-[#F5E6D3] mb-2">
                {t('reservations.contact.email.title')}
              </h4>
              <p className="text-sm text-[#F5E6D3]/70 mb-4">
                {t('reservations.contact.email.description')}
              </p>
              <a 
                href="mailto:Info@capitolo-rosso.de"
                className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-[#D4AF37] text-[#F5E6D3] font-semibold rounded-md hover:bg-[#D4AF37] hover:text-[#410704] transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer text-base"
              >
                <i className="ri-mail-line text-xl"></i>
                Info@capitolo-rosso.de
              </a>
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
