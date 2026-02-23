
import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function RestaurantStory() {
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
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#410704]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full aspect-square">
                <img 
                  src="/interior/DSC04026.jpeg" 
                  alt="Restaurant Interior" 
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/40 to-transparent"></div>
            </div>
            
            {/* Elegant Accent Image */}
            <div className={`absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <img 
                src="/gallery/DSC03816.jpeg" 
                alt="Fine Wine" 
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div>
              <span className="text-[#C7A454] font-medium text-sm tracking-wider uppercase">
                {t('story.subtitle')}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mt-4 mb-6">
                {t('story.title')}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F]"></div>
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl font-serif text-[#C7A454]">
                {t('story.philosophy')}
              </h3>
              
              <p className="text-base text-[#F5E6D3]/80 leading-relaxed">
                {t('story.p1')}
              </p>
              
              <p className="text-base text-[#F5E6D3]/80 leading-relaxed">
                {t('story.p2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
