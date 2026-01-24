import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function Directions() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const sections = [
    {
      icon: 'ri-subway-line',
      title: t('contact.directions.publicTransport'),
      items: [
        'U6 Französische Straße (3 min walk)',
        'S1, S2, S25 Friedrichstraße (5 min walk)',
        'Bus Lines 147, 245 Friedrichstraße (2 min walk)'
      ]
    },
    {
      icon: 'ri-parking-box-line',
      title: t('contact.directions.parking'),
      items: [
        'Q-Park Friedrichstraße, 200m away (Open 24/7)',
        'Limited metered street parking available (Mon-Sat 9:00-20:00)'
      ]
    },
    {
      icon: 'ri-wheelchair-line',
      title: t('contact.directions.accessibility'),
      items: [
        t('contact.directions.accessibility.description')
      ],
      isAccessibility: true
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704]">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('contact.directions.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('contact.directions.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              
              <div className="p-8 h-full flex flex-col">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#D4AF37] via-[#C7A454] to-[#B8941F] rounded-full">
                  <i className={`${section.icon} text-3xl text-white`}></i>
                </div>
                
                <h3 className="text-2xl font-serif text-[#F5E6D3] mb-6 text-center">
                  {section.title}
                </h3>
                
                <div className="flex-1 space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <i className="ri-arrow-right-line text-[#C7A454] text-lg mt-0.5 flex-shrink-0"></i>
                      <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
