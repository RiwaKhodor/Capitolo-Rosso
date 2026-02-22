import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ContactForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Send email via API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      // Check if response is ok and has content
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const text = await response.text();
          if (text) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.error || errorData.details || errorMessage;
            } catch (parseErr) {
              // If not JSON, use the text as error message
              errorMessage = text || errorMessage;
            }
          }
        } catch (e) {
          console.error('Error reading error response:', e);
        }
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Parse JSON response
      let data;
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server. Please check if the API is configured correctly.');
      }

      if (data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // Show the actual error message from the API
        const errorMsg = data.error || data.details || 'Failed to send email';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      
      // Show the actual error message if available
      let errorMessage = 'Error sending email. Please try again later or contact us directly.';
      
      if (error instanceof Error) {
        // Use the actual error message from the API
        errorMessage = error.message;
        
        // Only use generic messages for network/connection errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = language === 'de' 
            ? 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.'
            : 'Connection error. Please check your internet connection.';
        } else if (error.message.includes('Invalid response') || error.message.includes('Empty response')) {
          errorMessage = language === 'de'
            ? 'API nicht konfiguriert. Bitte kontaktieren Sie den Administrator.'
            : 'API not configured. Please contact the administrator.';
        }
        // For all other errors (including API error messages), show the actual message
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-[#410704]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {language === 'de' ? 'Kontaktformular' : 'Contact Form'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-6"></div>
          <p className="text-lg text-[#F5E6D3]/80 max-w-2xl mx-auto">
            {language === 'de' 
              ? 'Füllen Sie das Formular aus und wir werden uns so schnell wie möglich bei Ihnen melden.'
              : 'Fill out the form and we will get back to you as soon as possible.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative bg-[#5A0A06]/95 backdrop-blur-sm rounded-lg border border-[#C7A454]/20 p-8 md:p-12 shadow-2xl">
          {/* Top-left corner border */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
          
          {/* Bottom-right corner border */}
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

          <div className="space-y-6">
            {/* Name and Email on one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F5E6D3] mb-2">
                  {language === 'de' ? 'Name' : 'Name'} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#410704] border border-[#C7A454]/30 rounded-md text-[#F5E6D3] placeholder-[#F5E6D3]/50 focus:outline-none focus:border-[#C7A454] focus:ring-2 focus:ring-[#C7A454]/20 transition-all"
                  placeholder={language === 'de' ? 'Ihr Name' : 'Your Name'}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F5E6D3] mb-2">
                  {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#410704] border border-[#C7A454]/30 rounded-md text-[#F5E6D3] placeholder-[#F5E6D3]/50 focus:outline-none focus:border-[#C7A454] focus:ring-2 focus:ring-[#C7A454]/20 transition-all"
                  placeholder={language === 'de' ? 'ihre@email.de' : 'your@email.com'}
                />
              </div>
            </div>

            {/* Phone and Subject on one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#F5E6D3] mb-2">
                  {language === 'de' ? 'Telefonnummer' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#410704] border border-[#C7A454]/30 rounded-md text-[#F5E6D3] placeholder-[#F5E6D3]/50 focus:outline-none focus:border-[#C7A454] focus:ring-2 focus:ring-[#C7A454]/20 transition-all"
                  placeholder={language === 'de' ? 'Ihre Telefonnummer' : 'Your Phone Number'}
                />
              </div>

              {/* Subject - Optional */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#F5E6D3] mb-2">
                  {language === 'de' ? 'Betreff' : 'Subject'}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#410704] border border-[#C7A454]/30 rounded-md text-[#F5E6D3] placeholder-[#F5E6D3]/50 focus:outline-none focus:border-[#C7A454] focus:ring-2 focus:ring-[#C7A454]/20 transition-all"
                  placeholder={language === 'de' ? 'Betreff Ihrer Nachricht' : 'Subject of your message'}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#F5E6D3] mb-2">
                {language === 'de' ? 'Nachricht' : 'Message'} *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-[#410704] border border-[#C7A454]/30 rounded-md text-[#F5E6D3] placeholder-[#F5E6D3]/50 focus:outline-none focus:border-[#C7A454] focus:ring-2 focus:ring-[#C7A454]/20 transition-all resize-none"
                placeholder={language === 'de' ? 'Ihre Nachricht...' : 'Your message...'}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:from-[#F5E6D3] hover:via-[#D4AF37] hover:to-[#C7A454] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting 
                  ? (language === 'de' ? 'Wird gesendet...' : 'Sending...')
                  : (language === 'de' ? 'Nachricht senden' : 'Send Message')
                }
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-md">
                <p className="text-green-400 text-sm">
                  {language === 'de' 
                    ? '✓ Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns bald bei Ihnen melden.'
                    : '✓ Your message has been sent successfully! We will get back to you soon.'}
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-md">
                <p className="text-red-400 text-sm">
                  {errorMessage || (language === 'de' 
                    ? '✗ Fehler beim Senden. Bitte versuchen Sie es erneut.'
                    : '✗ Error sending message. Please try again.')}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
