import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function Services() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const services = [
    {
      icon: 'ri-bowl-line',
      name: t('about.services.catering'),
    },
    {
      icon: 'ri-umbrella-line',
      name: t('about.services.outsideSeating'),
    },
    {
      icon: 'ri-shopping-bag-line',
      name: t('about.services.takeaway'),
    },
    {
      icon: 'ri-ring-line',
      name: t('about.services.weddingReceptions'),
    },
    {
      icon: 'ri-wifi-line',
      name: t('about.services.freeWifi'),
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#5A0A06] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245, 230, 211, 0.1) 35px, rgba(245, 230, 211, 0.1) 70px)'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.services.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.services.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 bg-gradient-to-br from-[#D4AF37] via-[#C7A454] to-[#B8941F] rounded-full transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <i className={`${service.icon} text-2xl md:text-3xl text-[#410704]`}></i>
              </div>
              <h3 className="text-sm md:text-base font-serif text-[#F5E6D3]">
                {service.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
