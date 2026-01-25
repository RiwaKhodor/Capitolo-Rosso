import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../home/components/Navbar';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
        };
      };
    };
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const { login, register, loginWithGoogle, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleSignIn = useCallback(async (response: any) => {
    if (response.credential) {
      setError('');
      const success = await loginWithGoogle(response.credential);
      if (success) {
        // Get user from localStorage immediately after Google login
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.isAdmin) {
          navigate('/manage');
        } else {
          navigate('/');
        }
      } else {
        setError(t('login.googleFailed'));
      }
    }
  }, [loginWithGoogle, navigate, t]);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    const initializeGoogleButton = () => {
      if (window.google && googleButtonRef.current) {
        // Get Google Client ID from environment variable or use a default
        // To set up: Create a Google OAuth 2.0 Client ID at https://console.cloud.google.com/apis/credentials
        // Then add it to your .env file as VITE_GOOGLE_CLIENT_ID
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        
        if (clientId) {
          // Clear any existing content
          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = '';
          }
          
          // Only allow German (de) or English (en), default to English
          // Force locale to prevent Arabic or other languages
          const googleLocale = language === 'de' ? 'de' : 'en';
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            ux_mode: 'popup',
            locale: googleLocale,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: '100%',
            locale: googleLocale,
          });
        } else {
          // Show a message if Google Client ID is not configured
          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = `
              <div class="text-center p-3 bg-[#410704]/50 rounded text-xs text-[#F5E6D3]/70">
                <p>Google Sign-In requires configuration</p>
                <p class="mt-1">Set VITE_GOOGLE_CLIENT_ID in .env</p>
              </div>
            `;
          }
        }
      }
    };

    script.onload = initializeGoogleButton;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      // If script already loaded, initialize immediately
      initializeGoogleButton();
    }

    return () => {
      // Don't remove script on cleanup as it might be used elsewhere
    };
  }, [handleGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        // Get user from localStorage immediately after login
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.isAdmin) {
          navigate('/manage');
        } else {
          navigate('/');
        }
      } else {
        setError(t('login.invalidCredentials'));
      }
    } else {
      if (!name.trim()) {
        setError(t('login.nameRequired'));
        return;
      }
      const success = await register(email, password, name);
      if (success) {
        // Get user from localStorage immediately after registration
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.isAdmin) {
          navigate('/manage');
        } else {
          navigate('/');
        }
      } else {
        setError(t('login.emailExists'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#410704]">
      <Navbar scrolled={true} />
      
      {/* Hero Section with Background */}
      <section className="relative pt-32 pb-24 px-6 min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Elegant Background - Same as About Page */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 object-top"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=Luxurious%20Italian%20restaurant%20interior%20with%20elegant%20table%20settings%20crystal%20chandeliers%20warm%20golden%20lighting%20burgundy%20velvet%20chairs%20and%20sophisticated%20ambiance%20creating%20perfect%20dining%20atmosphere%20for%20special%20occasions&width=1920&height=1000&seq=reservation-hero-bg-001&orientation=landscape)'
          }}
        ></div>

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
                {isLogin ? t('login.welcomeBack') : t('login.joinUs')}
              </span>
              <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
              {isLogin ? t('login.title') : t('login.createAccount')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto"></div>
          </div>

          {/* Login Card with Corner Borders */}
          <div className="relative bg-[#5A0A06]/95 backdrop-blur-sm p-10 rounded-lg border border-[#C7A454]/20 shadow-2xl">
            {/* Top-left corner border */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
            
            {/* Bottom-right corner border */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm flex items-center gap-2">
                <i className="ri-error-warning-line text-lg"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-medium text-[#C7A454] mb-2 tracking-wide">
                    {t('login.name')}
                  </label>
                  <div className="relative">
                    <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A454]/70 text-lg"></i>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#410704]/50 border border-[#C7A454]/30 rounded text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:outline-none focus:border-[#C7A454] focus:bg-[#410704]/70 transition-all duration-300"
                      placeholder={t('login.enterName')}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-medium text-[#C7A454] mb-2 tracking-wide">
                  {t('login.email')}
                </label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A454]/70 text-lg"></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#410704]/50 border border-[#C7A454]/30 rounded text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:outline-none focus:border-[#C7A454] focus:bg-[#410704]/70 transition-all duration-300"
                    placeholder={t('login.enterEmail')}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-[#C7A454] mb-2 tracking-wide">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A454]/70 text-lg"></i>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#410704]/50 border border-[#C7A454]/30 rounded text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:outline-none focus:border-[#C7A454] focus:bg-[#410704]/70 transition-all duration-300"
                    placeholder={t('login.enterPassword')}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:scale-105 text-base tracking-wide"
              >
                {isLogin ? t('login.signIn') : t('login.createAccount')}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#C7A454]/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#5A0A06] text-[#C7A454]/80 font-medium tracking-wide">{t('login.orContinue')}</span>
                </div>
              </div>

              <div ref={googleButtonRef} className="mt-6 flex justify-center"></div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-[#C7A454] hover:text-[#D4AF37] transition-colors duration-300 font-medium"
              >
                {isLogin ? (
                  <>
                    {t('login.noAccount')} <span className="underline">{t('login.register')}</span>
                  </>
                ) : (
                  <>
                    {t('login.haveAccount')} <span className="underline">{t('login.title')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
