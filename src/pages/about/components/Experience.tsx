import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function Experience() {
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
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245, 230, 211, 0.1) 35px, rgba(245, 230, 211, 0.1) 70px)'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.experience.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.experience.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className={`flex items-start gap-6 group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <i className="ri-restaurant-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                  {t('about.experience.dining.title')}
                </h3>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('about.experience.dining.description')}
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-6 group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <i className="ri-goblet-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                  {t('about.experience.wine.title')}
                </h3>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('about.experience.wine.description')}
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-6 group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <i className="ri-music-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                  {t('about.experience.ambiance.title')}
                </h3>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('about.experience.ambiance.description')}
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-6 group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <i className="ri-service-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                  {t('about.experience.service.title')}
                </h3>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                  {t('about.experience.service.description')}
                </p>
              </div>
            </div>
          </div>

          <div className={`hidden md:block relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="w-full h-[600px] rounded-lg overflow-hidden">
              <img 
                src="/interior/DSC04042%281%29.jpeg" 
                alt="Restaurant Experience" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-[#C7A454] rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
