import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function Philosophy() {
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

  const philosophies = [
    {
      icon: 'ri-star-line',
      title: t('about.philosophy.quality.title'),
      description: t('about.philosophy.quality.description')
    },
    {
      icon: 'ri-plant-line',
      title: t('about.philosophy.selection.title'),
      description: t('about.philosophy.selection.description')
    },
    {
      icon: 'ri-heart-line',
      title: t('about.philosophy.ambiance.title'),
      description: t('about.philosophy.ambiance.description')
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704]">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.philosophy.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.philosophy.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {philosophies.map((item, index) => (
            <div 
              key={index}
              className={`relative group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Top-left corner */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454] transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>
              
              {/* Bottom-right corner */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454] transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>
              
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto flex items-center justify-center">
                  <i className={`${item.icon} text-5xl text-[#C7A454]`}></i>
                </div>
                
                <h3 className="text-xl font-serif text-[#F5E6D3]">
                  {item.title}
                </h3>
                
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
