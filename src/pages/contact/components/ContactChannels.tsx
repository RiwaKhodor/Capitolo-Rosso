import { useLanguage } from '../../../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function ContactChannels() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [cardsVisible, setCardsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    const cardsEl = cardsRef.current;
    
    if (!headerEl || !cardsEl) return;

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    const cardsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
        } else {
          setCardsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    headerObserver.observe(headerEl);
    cardsObserver.observe(cardsEl);

    return () => {
      headerObserver.unobserve(headerEl);
      cardsObserver.unobserve(cardsEl);
    };
  }, []);

  const channels = [
    { 
      icon: 'ri-phone-line', 
      title: 'Phone', 
      text: '+49 (0)30 44058471',
      action: 'tel:+493044058471'
    },
    { 
      icon: 'ri-mail-line', 
      title: 'Email', 
      text: 'Info@capitolo-rosso.de',
      action: 'mailto:Info@capitolo-rosso.de'
    },
    { 
      icon: 'ri-instagram-line', 
      title: 'Instagram', 
      text: '@capitolo_rosso',
      action: 'https://instagram.com/capitolo_rosso'
    },
    { 
      icon: 'ri-facebook-fill', 
      title: 'Facebook', 
      text: 'Capitolo Rosso Berlin',
      action: 'https://facebook.com'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ease-out px-4 md:px-0 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95'}`}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('contact.channels.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 px-4 md:px-0">
            <div className={`w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '200ms' }}></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('contact.channels.subtitle')}
            </span>
            <div className={`w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`} style={{ transitionDelay: '200ms' }}></div>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {channels.map((channel, i) => (
            <a
              key={i}
              href={channel.action}
              target={channel.action.startsWith('http') ? '_blank' : undefined}
              rel={channel.action.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`group text-center transition-all duration-700 ease-out ${cardsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="p-4 md:p-8 hover:transform hover:scale-105 transition-all duration-300">
                <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6 bg-gradient-to-br from-[#D4AF37] via-[#C7A454] to-[#B8941F] rounded-full transform transition-all duration-500 ${cardsVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'} group-hover:scale-110 group-hover:rotate-6`} style={{ transitionDelay: `${i * 150 + 200}ms` }}>
                  <i className={`${channel.icon} text-2xl md:text-3xl text-white`}></i>
                </div>
                <h3 className={`text-base md:text-xl font-serif text-[#F5E6D3] mb-2 md:mb-3 transition-all duration-500 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 150 + 300}ms` }}>
                  {channel.title}
                </h3>
                <p className={`text-xs md:text-base text-[#F5E6D3]/80 transition-all duration-500 whitespace-nowrap ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 150 + 400}ms` }}>
                  {channel.text}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
