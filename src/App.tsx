import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter basename={__BASE_PATH__}>
            <AppRoutes />
            <CookieConsent />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;