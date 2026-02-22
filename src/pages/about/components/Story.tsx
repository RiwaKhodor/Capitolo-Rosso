import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function Story() {
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
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.story.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.story.subtitle')}
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
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={`absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <img 
                src="/gallery/DSC03816.jpeg" 
                alt="A Culinary Journey Through Italy" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.story.p1')}
            </p>
            
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.story.p2')}
            </p>
            
            <p className="text-base text-[#F5E6D3] leading-relaxed">
              {t('about.story.p3')}
            </p>

            <div className="pt-6">
              <div className="flex items-start gap-4 p-6 bg-[#F5E6D3]/10 rounded-lg border-l-4 border-[#C7A454]">
                <i className="ri-double-quotes-l text-3xl text-[#C7A454]"></i>
                <p className="text-base text-[#F5E6D3] italic leading-relaxed">
                  {t('about.story.quote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
