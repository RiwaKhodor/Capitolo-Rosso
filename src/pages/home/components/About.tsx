import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function About() {
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

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="w-full aspect-square md:h-[500px] rounded-lg overflow-hidden">
              <img 
                src="/interior/DSC04042%281%29.jpeg" 
                alt="A Culinary Journey Through Italy" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <img 
                src="/gallery/DSC03816.jpeg" 
                alt="A Culinary Journey Through Italy" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.p1')}
            </p>
            
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.p2')}
            </p>
            
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.p3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
