import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top when route changes (especially important on mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleQuickLinkClick = (path: string) => {
    // Scroll to top immediately before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Navigate to the new page
    navigate(path);
    
    // Ensure scroll to top after navigation completes (important for mobile)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  };

  return (
    <footer className="bg-[#410704] text-[#F5E6D3] py-16 px-6 border-t-2 border-[#C7A454]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12 text-center">
          <div>
            <img 
              src="/logo.png" 
              alt="Capitolo Rosso" 
              className="h-16 w-auto mb-6 mx-auto md:mx-0"
            />
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-[#C7A454] font-semibold mb-4 text-sm">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleQuickLinkClick('/')}
                  className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickLinkClick('/menu')}
                  className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                >
                  {t('nav.menu')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickLinkClick('/reservations')}
                  className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                >
                  {t('nav.reservations')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickLinkClick('/contact')}
                  className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#C7A454] font-semibold mb-4 text-sm">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/impressum" className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer">
                  {t('footer.impressum')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-[#C7A454] transition-colors duration-300 cursor-pointer">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#C7A454] font-semibold mb-4 text-sm">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start justify-center md:justify-start">
                <i className="ri-phone-line text-[#C7A454] mt-1 mr-3"></i>
                <a href="tel:+493044058471" className="text-sm hover:text-[#C7A454] transition-colors">+49 (0)30 44058471</a>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <i className="ri-mail-line text-[#C7A454] mt-1 mr-3"></i>
                <a href="mailto:Info@capitolo-rosso.de" className="text-sm hover:text-[#C7A454] transition-colors">Info@capitolo-rosso.de</a>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <i className="ri-map-pin-line text-[#C7A454] mt-1 mr-3"></i>
                <span className="text-sm">Choriner Straße 72<br />Ecke Zionskirchstraße<br />10119 Berlin<br />Germany</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6 justify-center md:justify-start">
              <a href="https://instagram.com/capitolo_rosso" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-[#C7A454] rounded-full hover:bg-[#F5E6D3] transition-colors duration-300 cursor-pointer">
                <i className="ri-instagram-line text-[#410704] text-lg"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-[#C7A454] rounded-full hover:bg-[#F5E6D3] transition-colors duration-300 cursor-pointer">
                <i className="ri-facebook-fill text-[#410704] text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#C7A454]/30 pt-8 text-center">
          <p className="text-sm">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}