import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const testimonials = [
    {
      name: 'Sophie Laurent',
      role: t('testimonials.role.foodCritic'),
      image: 'https://readdy.ai/api/search-image?query=Professional%20elegant%20woman%20food%20critic%20with%20sophisticated%20appearance%20warm%20smile%20refined%20features%20wearing%20elegant%20attire%20against%20soft%20neutral%20background%20studio%20portrait%20high%20quality%20photography&width=200&height=200&seq=testimonial-sophie-001&orientation=squarish',
      rating: 5,
      text: t('testimonials.sophie.text')
    },
    {
      name: 'Marco Rossi',
      role: t('testimonials.role.regularCustomer'),
      image: 'https://readdy.ai/api/search-image?query=Handsome%20Italian%20man%20with%20warm%20friendly%20smile%20distinguished%20appearance%20casual%20elegant%20style%20against%20soft%20neutral%20background%20studio%20portrait%20high%20quality%20photography&width=200&height=200&seq=testimonial-marco-002&orientation=squarish',
      rating: 5,
      text: t('testimonials.marco.text')
    },
    {
      name: 'Emma Thompson',
      role: t('testimonials.role.travelBlogger'),
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20young%20woman%20travel%20blogger%20with%20bright%20smile%20natural%20beauty%20casual%20chic%20style%20against%20soft%20neutral%20background%20studio%20portrait%20high%20quality%20photography&width=200&height=200&seq=testimonial-emma-003&orientation=squarish',
      rating: 5,
      text: t('testimonials.emma.text')
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#F5E6D3] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C7A454]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#410704]/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] bg-clip-text text-transparent tracking-widest uppercase px-6 py-2 rounded-full border border-[#C7A454]/30">
              {t('testimonials.title')}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-[#410704] mb-6">
            {t('testimonials.subtitle')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <i className="ri-chat-quote-line text-3xl bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] bg-clip-text text-transparent"></i>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 relative">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 w-16 h-16 flex items-center justify-center">
              <i className="ri-double-quotes-l text-6xl text-[#C7A454]/20"></i>
            </div>

            {/* Content */}
            <div className="text-center space-y-8">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#C7A454]/30">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-2xl text-[#D4AF37]"></i>
                ))}
              </div>

              {/* Text */}
              <p className="text-lg md:text-xl text-[#410704]/80 leading-relaxed max-w-3xl mx-auto italic">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Name & Role */}
              <div>
                <h4 className="text-2xl font-serif text-[#410704] mb-1">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm text-[#C7A454] font-medium tracking-wider uppercase">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] hover:bg-[#410704] hover:text-[#F5E6D3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === currentIndex 
                      ? 'w-8 h-3 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F]' 
                      : 'w-3 h-3 bg-[#C7A454]/30 hover:bg-[#C7A454]/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] hover:bg-[#410704] hover:text-[#F5E6D3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
              aria-label="Next testimonial"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}