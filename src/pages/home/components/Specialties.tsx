import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function Specialties() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const menuCategories = [
    {
      id: 'suppen',
      title: language === 'de' ? 'Suppen' : 'Soups',
      icon: 'ri-bowl-line',
      color: 'from-[#8B4513] to-[#A0522D]'
    },
    {
      id: 'antipasti',
      title: language === 'de' ? 'Antipasti' : 'Appetizers',
      icon: 'ri-restaurant-2-line',
      color: 'from-[#C7A454] to-[#D4AF37]'
    },
    {
      id: 'salate',
      title: language === 'de' ? 'Salate' : 'Salads',
      icon: 'ri-leaf-line',
      color: 'from-[#6B8E23] to-[#8FBC8F]'
    },
    {
      id: 'pasta',
      title: language === 'de' ? 'Pasta' : 'Pasta',
      icon: 'material-symbols-outlined',
      iconName: 'dinner_dining',
      color: 'from-[#CD853F] to-[#DEB887]'
    },
    {
      id: 'tagliatelle-gnocchi',
      title: language === 'de' ? 'Tagliatelle & Gnocchi' : 'Tagliatelle & Gnocchi',
      icon: 'ri-restaurant-line',
      color: 'from-[#B8860B] to-[#DAA520]'
    },
    {
      id: 'pizza',
      title: language === 'de' ? 'Pizza' : 'Pizza',
      icon: 'material-symbols-outlined',
      iconName: 'local_pizza',
      color: 'from-[#DC143C] to-[#FF6347]'
    },
    {
      id: 'focaccia',
      title: language === 'de' ? 'Focaccia' : 'Focaccia',
      icon: 'ri-bread-line',
      color: 'from-[#D2691E] to-[#CD853F]'
    },
    {
      id: 'fleischgerichte',
      title: language === 'de' ? 'Fleischgerichte' : 'Meat Dishes',
      icon: 'ri-fire-line',
      color: 'from-[#8B0000] to-[#A52A2A]'
    },
    {
      id: 'fischgerichte',
      title: language === 'de' ? 'Fischgerichte' : 'Fish Dishes',
      icon: 'ri-anchor-line',
      color: 'from-[#4682B4] to-[#5F9EA0]'
    },
    {
      id: 'dessert',
      title: language === 'de' ? 'Dessert' : 'Dessert',
      icon: 'ri-cake-2-line',
      color: 'from-[#D4AF37] to-[#C7A454]'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu#${categoryId}`);
    setTimeout(() => {
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#410704] relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C7A454]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#410704]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo.png" 
              alt="Capitolo Rosso" 
              className="h-40 md:h-48 w-auto drop-shadow-2xl"
            />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-[#F5E6D3] mb-6">
            {t('menu.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <i className="ri-restaurant-2-line text-3xl bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] bg-clip-text text-transparent"></i>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          <p className="text-lg text-[#F5E6D3]/80 max-w-3xl mx-auto leading-relaxed">
            {t('specialties.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {menuCategories.map((category, index) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-700 rounded-lg border border-[#C7A454]/20 bg-[#5A0A06]/50 hover:bg-[#5A0A06]/80 hover:border-[#C7A454]/40 hover:shadow-xl hover:shadow-[#C7A454]/20 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C7A454]/30 group-hover:border-[#C7A454] transition-colors"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C7A454]/30 group-hover:border-[#C7A454] transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#C7A454]/30 group-hover:border-[#C7A454] transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C7A454]/30 group-hover:border-[#C7A454] transition-colors"></div>

              {/* Icon */}
              <div 
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
              >
                {(category.id === 'pizza' || category.id === 'pasta') && category.iconName ? (
                  <span className={`${category.icon} text-4xl md:text-6xl bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] bg-clip-text text-transparent transition-all duration-500 ${hoveredIndex === index ? 'scale-110' : ''}`}>
                    {category.iconName}
                  </span>
                ) : (
                  <i className={`${category.icon} text-4xl md:text-6xl bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] bg-clip-text text-transparent transition-all duration-500 ${hoveredIndex === index ? 'scale-110' : ''}`}></i>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-xl font-serif text-[#F5E6D3] text-center group-hover:text-[#C7A454] transition-colors duration-300">
                {category.title}
              </h3>
            </div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => {
              navigate('/menu');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="inline-flex flex-wrap items-center justify-center gap-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] px-6 md:px-10 py-5 rounded-full font-semibold text-base md:text-lg hover:bg-[#410704] hover:text-[#F5E6D3] hover:ring-2 hover:ring-[#C7A454] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
          >
            <i className="ri-book-open-line text-xl md:text-2xl"></i>
            <span>{t('hero.viewFullMenu')}</span>
            <i className="ri-arrow-right-line text-lg md:text-xl"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
