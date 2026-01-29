import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function ContactInfo() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const openingHours = [
    { day: t('about.contact.hours.monday'), hours: t('about.contact.hours.monday.time') },
    { day: t('about.contact.hours.tuesday'), hours: t('about.contact.hours.tuesday.time') },
    { day: t('about.contact.hours.wednesday'), hours: t('about.contact.hours.wednesday.time') },
    { day: t('about.contact.hours.thursday'), hours: t('about.contact.hours.thursday.time') },
    { day: t('about.contact.hours.friday'), hours: t('about.contact.hours.friday.time') },
    { day: t('about.contact.hours.saturday'), hours: t('about.contact.hours.saturday.time') },
    { day: t('about.contact.hours.sunday'), hours: t('about.contact.hours.sunday.time') }
  ];

  return (
    <section className="py-24 px-6 bg-[#5A0A06]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.contact.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.contact.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div>
          <div className="grid md:grid-cols-2 gap-12 items-stretch mb-0 md:mb-0">
            {/* Left Column: Contact Details */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              
              <div className="pt-8 px-4 md:px-8 pb-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-map-pin-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.address.title')}
                    </h3>
                    <p className="text-sm text-[#F5E6D3]/80 leading-relaxed break-words">
                      {t('about.contact.address.line1')}<br />
                      {t('about.contact.address.line2')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.phone.title')}
                    </h3>
                    <p className="text-xs md:text-sm text-[#F5E6D3]/70 mb-2 break-words">
                      {t('contact.phone.description')}
                    </p>
                    <a 
                      href="tel:+493044058471" 
                      className="text-sm text-[#F5E6D3]/80 hover:text-[#C7A454] transition-colors duration-300 cursor-pointer break-words"
                    >
                      +49 (0)30 44058471
                    </a>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-0">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-serif text-[#F5E6D3] mb-2">
                      {t('about.contact.email.title')}
                    </h3>
                    <p className="text-xs md:text-sm text-[#F5E6D3]/70 mb-2 break-words">
                      {t('contact.email.description')}
                    </p>
                    <a 
                      href="mailto:Info@capitolo-rosso.de" 
                      className="text-sm text-[#F5E6D3]/80 hover:text-[#C7A454] transition-colors duration-300 cursor-pointer break-words"
                    >
                      Info@capitolo-rosso.de
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Opening Hours */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C7A454]"></div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <i className="ri-time-line text-2xl text-[#C7A454]"></i>
                  </div>
                  <h3 className="text-2xl font-serif text-[#F5E6D3]">
                    {t('about.contact.hours.title')}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {openingHours.map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-[#F5E6D3]/10 last:border-0"
                    >
                      <span className="text-sm font-medium text-[#F5E6D3]">
                        {item.day}
                      </span>
                      <span className="text-sm text-[#F5E6D3]/80">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map - Below the 2 divs on mobile, beside on desktop */}
          <div className="mt-12 md:mt-16">
            <div className="rounded-lg overflow-hidden h-[200px] md:h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.0145307306!2d13.404322976681907!3d52.533171272064564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851fcbfaf2af3%3A0x17e47363e267feec!2sChoriner%20Str.%2072%2C%2010119%20Berlin%2C%20Germany!5e0!3m2!1sen!2slb!4v1769302423864!5m2!1sen!2slb"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Capitolo Rosso Location"
              ></iframe>
            </div>
            
            {/* Login Button - Below Map, Bottom Right */}
            {!user && (
              <div className="mt-6 flex justify-end">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] rounded-md font-semibold hover:from-[#410704] hover:via-[#410704] hover:to-[#410704] hover:text-[#C7A454] transition-all duration-300 cursor-pointer text-sm whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
