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
                src="https://readdy.ai/api/search-image?query=charming%20vintage%20bookstore%20wine%20bar%20interior%20called%20vino%20e%20libri%20with%20wooden%20bookshelves%20filled%20with%20books%20wine%20bottles%20cozy%20warm%20lighting%20rustic%20european%20atmosphere%20berlin%20style%20intimate%20cultural%20space%20burgundy%20and%20cream%20tones%20nostalgic%20ambiance&width=600&height=800&seq=story-vino-libri&orientation=portrait" 
                alt="Vino e Libri" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <img 
                src="https://readdy.ai/api/search-image?query=elegant%20french%20wine%20bottle%20with%20red%20wine%20glass%20on%20dark%20burgundy%20background%20sophisticated%20restaurant%20setting%20warm%20golden%20lighting%20luxury%20dining%20atmosphere%20bordeaux%20wine%20premium%20quality%20refined%20composition&width=400&height=400&seq=story-wine-accent&orientation=squarish" 
                alt="Wine Glass" 
                className="w-full h-full object-cover"
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
