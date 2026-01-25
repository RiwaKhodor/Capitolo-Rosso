import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function LocationContact() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const openingHours = [
    { day: t('about.contact.hours.monday'), hours: t('about.contact.hours.monday.time') },
    { day: t('about.contact.hours.tuesday'), hours: t('about.contact.hours.tuesday.time') },
    { day: t('about.contact.hours.wednesday'), hours: t('about.contact.hours.wednesday.time') },
    { day: t('about.contact.hours.thursday'), hours: t('about.contact.hours.thursday.time') },
    { day: t('about.contact.hours.friday'), hours: t('about.contact.hours.friday.time') },
    { day: t('about.contact.hours.saturday'), hours: t('about.contact.hours.saturday.time') },
    { day: t('about.contact.hours.sunday'), hours: t('about.contact.hours.sunday.time') }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#5A0A06]">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('contact.location.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('contact.location.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div>
          <div className="grid md:grid-cols-2 gap-12 items-stretch mb-0 md:mb-0">
            {/* Left Column: Contact Details */}
            <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '100ms' }}>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              
              <div className="pt-8 px-8 pb-0">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-map-pin-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.address.title')}
                    </h3>
                    <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                      {t('about.contact.address.line1')}<br />
                      {t('about.contact.address.line2')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.phone.title')}
                    </h3>
                    <a 
                      href="tel:+493044058471" 
                      className="text-sm text-[#F5E6D3]/80 hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                    >
                      +49 (0)30 44058471
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-0">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.email.title')}
                    </h3>
                    <a 
                      href="mailto:info@vinoelibri.com" 
                      className="text-sm text-[#F5E6D3]/80 hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                    >
                      info@vinoelibri.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Opening Hours */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <i className="ri-time-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <h3 className="text-2xl font-serif text-[#F5E6D3]">
                    {t('about.contact.hours.title')}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {openingHours.map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-[#F5E6D3]/10 last:border-0"
                    >
                      <span className="text-sm font-medium text-[#F5E6D3]">
                        {item.day}
                      </span>
                      <span className="text-sm text-[#F5E6D3]/80">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map - Below the 2 divs on mobile */}
          <div className={`rounded-lg overflow-hidden h-[200px] md:h-[300px] mt-12 md:mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '200ms' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.0145307306!2d13.404322976681907!3d52.533171272064564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851fcbfaf2af3%3A0x17e47363e267feec!2sChoriner%20Str.%2072%2C%2010119%20Berlin%2C%20Germany!5e0!3m2!1sen!2slb!4v1769302423864!5m2!1sen!2slb"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Capitolo Rosso Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
