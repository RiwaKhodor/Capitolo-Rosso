import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-[#5A0A06] border-t-2 border-[#C7A454] shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-serif text-[#C7A454] mb-2">
              {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
            </h3>
            <p className="text-sm text-[#F5E6D3]/90 leading-relaxed">
              {language === 'de' 
                ? 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. Weitere Informationen finden Sie in unserer '
                : 'We use cookies to provide you with the best possible experience on our website. By using our website, you agree to the use of cookies. For more information, please see our '}
              <Link 
                to="/privacy" 
                className="text-[#C7A454] hover:text-[#D4AF37] underline transition-colors"
                onClick={() => setIsVisible(false)}
              >
                {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
              </Link>
              {language === 'de' ? '.' : '.'}
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-6 py-2 bg-transparent border-2 border-[#C7A454] text-[#C7A454] font-semibold rounded-md hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300 whitespace-nowrap"
            >
              {language === 'de' ? 'Ablehnen' : 'Decline'}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              {language === 'de' ? 'Akzeptieren' : 'Accept'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
