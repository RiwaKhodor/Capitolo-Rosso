import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from '../../../components/feature/LanguageSwitcher';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

interface NavbarProps {
  scrolled: boolean;
}

// Compact Language Switcher for Mobile
function CompactLanguageSwitcher({ scrolled }: { scrolled: boolean }) {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button
      onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 cursor-pointer ${
        scrolled 
          ? 'bg-[#C7A454] text-[#410704] hover:bg-[#D4AF37]' 
          : 'bg-[#C7A454] text-[#410704] hover:bg-[#D4AF37]'
      }`}
      aria-label="Toggle language"
    >
      {language.toUpperCase().slice(0, 2)}
    </button>
  );
}

export default function Navbar({ scrolled }: NavbarProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  const menuItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/reservations', label: t('nav.reservations') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/events-news', label: t('nav.eventsNews') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Scroll to top when route changes (especially important on mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleMobileNavClick = () => {
    // Scroll to top immediately before closing menu
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsOpen(false);
    // Ensure scroll after navigation completes
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#F5E6D3] shadow-lg' : 'bg-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <img 
              src="/logo.png" 
              alt="Capitolo Rosso" 
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.about')}
            </Link>
            <Link to="/menu" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.menu')}
            </Link>
            <Link to="/reservations" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.reservations')}
            </Link>
            <Link to="/gallery" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.gallery')}
            </Link>
            <Link to="/events-news" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.eventsNews')}
            </Link>
            <Link to="/contact" className="text-sm font-medium text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap cursor-pointer">
              {t('nav.contact')}
            </Link>
            <LanguageSwitcher />
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/manage"
                    className="px-6 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] rounded-md font-semibold hover:from-[#C7A454] hover:via-[#D4AF37] hover:to-[#C7A454] transition-all duration-300 cursor-pointer text-sm whitespace-nowrap shadow-lg hover:shadow-xl"
                  >
                    {t('nav.manage')}
                  </Link>
                )}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#C7A454] font-medium hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    <span>{user.name}</span>
                    <i className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#F5E6D3] rounded-md shadow-xl border border-[#C7A454]/30 overflow-hidden z-50">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-2 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold hover:from-[#C7A454] hover:via-[#D4AF37] hover:to-[#C7A454] transition-all duration-300 text-sm text-center"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] rounded-md font-semibold hover:from-[#410704] hover:via-[#410704] hover:to-[#410704] hover:text-[#C7A454] transition-all duration-300 cursor-pointer text-sm whitespace-nowrap"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile: Language Switcher and Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Compact Language Switcher */}
            <CompactLanguageSwitcher scrolled={scrolled} />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer ${
                scrolled ? 'text-[#410704]' : 'text-[#F5E6D3]'
              }`}
              aria-label="Toggle menu"
            >
              <i className={`${isOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 py-4 bg-[#F5E6D3] rounded-lg shadow-lg">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileNavClick}
                className="block px-6 py-3 text-[#C7A454] hover:text-[#D4AF37] hover:bg-[#410704]/5 transition-colors duration-300 cursor-pointer text-sm"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-6 py-3">
              <LanguageSwitcher />
            </div>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/manage"
                    onClick={handleMobileNavClick}
                    className="block mx-6 mt-4 px-6 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] text-center rounded-md font-semibold hover:from-[#C7A454] hover:via-[#D4AF37] hover:to-[#C7A454] transition-all duration-300 cursor-pointer text-sm shadow-lg"
                  >
                    {t('nav.manage')}
                  </Link>
                )}
                <div className="px-6 py-3 border-t border-[#410704]/20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      logout();
                      setIsOpen(false);
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-2 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] text-center rounded-md font-semibold hover:from-[#C7A454] hover:via-[#D4AF37] hover:to-[#C7A454] transition-all duration-300 cursor-pointer text-sm"
                    type="button"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="px-6 py-3">
                <Link
                  to="/login"
                  onClick={handleMobileNavClick}
                  className="block px-8 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] text-center rounded-md font-semibold hover:from-[#410704] hover:via-[#410704] hover:to-[#410704] hover:text-[#C7A454] transition-all duration-300 cursor-pointer text-sm mx-auto max-w-xs"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
