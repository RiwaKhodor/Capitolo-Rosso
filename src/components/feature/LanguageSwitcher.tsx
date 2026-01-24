import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-[#F5E6D3] rounded-full p-1">
      <button
        onClick={() => setLanguage('de')}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
          language === 'de'
            ? 'bg-[#C7A454] text-[#410704]'
            : 'bg-transparent text-[#410704] hover:bg-[#C7A454]/20'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
          language === 'en'
            ? 'bg-[#C7A454] text-[#410704]'
            : 'bg-transparent text-[#410704] hover:bg-[#C7A454]/20'
        }`}
      >
        EN
      </button>
    </div>
  );
}