import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import Services from '../about/components/Services';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { eventService } from '../../services/eventService';

interface Event {
  id: string | number;
  title: string;
  titleEn: string;
  date: string;
  category?: 'wine-event' | 'seasonal' | 'exclusive';
  image?: string;
  description: string;
  descriptionEn: string;
  time?: string;
  price?: string;
}

// Custom hook for intersection observer
function useInView(options: IntersectionObserverInit = {}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold]);

  return { ref, inView };
}

export default function EventsNews() {
  const [scrolled, setScrolled] = useState(false);
  const [dynamicEvents, setDynamicEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<Event | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Event>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2 });
  const { ref: servicesRef, inView: servicesInView } = useInView({ threshold: 0.1 });
  const { ref: eventsRef, inView: eventsInView } = useInView({ threshold: 0.1 });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load events from Supabase
    const loadEvents = async () => {
      try {
        const allEvents = await eventService.getAllEvents();
        console.log('Loaded events from Supabase:', allEvents);
        // Convert Supabase format to component format
        const formattedEvents: Event[] = allEvents.map(event => {
          // Handle both snake_case and camelCase field names from Supabase
          const title = (event as any).title || '';
          const titleEn = (event as any).title_en || (event as any).titleEn || title || '';
          const description = (event as any).description || '';
          const descriptionEn = (event as any).description_en || (event as any).descriptionEn || description || '';
          
          return {
            id: event.id,
            title: title,
            titleEn: titleEn,
            description: description,
            descriptionEn: descriptionEn,
            date: event.date || '',
            time: event.time || undefined,
            image: event.image || undefined,
          };
        });
        console.log('Formatted events:', formattedEvents);
        setDynamicEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setDynamicEvents([]);
      }
    };
    
    loadEvents();
    
    // Listen for storage events to refresh data
    const handleStorageChange = () => {
      loadEvents();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteEvent = (event: Event) => {
    setDeleteConfirmEvent(event);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteConfirmEvent?.id) return;
    
    setIsDeleting(true);
    
    try {
      const deleted = await eventService.deleteEvent(String(deleteConfirmEvent.id));
      if (deleted) {
        // Update local state directly instead of reloading all events
        setDynamicEvents(prevEvents => 
          prevEvents.filter(event => event.id !== deleteConfirmEvent.id)
        );
        setDeleteConfirmEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to translate English text to German using free translation API
  const translateToGerman = async (text: string): Promise<string> => {
    if (!text.trim()) return '';
    
    try {
      // Using MyMemory Translation API (free, no API key required for basic use)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|de`
      );
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      return text; // Fallback to original if translation fails
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original if translation fails
    }
  };

  // Auto-translate English to German
  const handleTranslateEvent = async () => {
    if (!editFormData.titleEn && !editFormData.descriptionEn) {
      alert('Please enter English text first');
      return;
    }

    const [translatedTitle, translatedDescription] = await Promise.all([
      editFormData.titleEn ? translateToGerman(editFormData.titleEn) : Promise.resolve(''),
      editFormData.descriptionEn ? translateToGerman(editFormData.descriptionEn) : Promise.resolve('')
    ]);

    setEditFormData({
      ...editFormData,
      title: translatedTitle || editFormData.title,
      description: translatedDescription || editFormData.description,
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    
    // Format date for HTML date input (YYYY-MM-DD)
    let formattedDate = event.date;
    if (formattedDate && formattedDate.includes('/')) {
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const parts = formattedDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      }
    } else if (formattedDate && formattedDate.includes('T')) {
      // If it's an ISO datetime, extract just the date part
      formattedDate = formattedDate.split('T')[0];
    }
    
    setEditFormData({
      title: event.title,
      titleEn: event.titleEn,
      description: event.description,
      descriptionEn: event.descriptionEn,
      date: formattedDate,
      time: event.time,
    });
  };

  const handleUpdateEvent = async () => {
    console.log('handleUpdateEvent called', { editingEvent, editFormData });
    
    if (!editingEvent?.id || !editFormData.title || !editFormData.date) {
      alert('Please fill in title and date');
      return;
    }

    try {
      let finalTitle = editFormData.title;
      let finalDescription = editFormData.description || '';
      let finalTitleEn = editFormData.titleEn || '';
      let finalDescriptionEn = editFormData.descriptionEn || '';

      // Auto-translate English to German if English fields exist but German fields are empty
      if (!finalTitle && finalTitleEn) {
        finalTitle = await translateToGerman(finalTitleEn);
      }
      if (!finalDescription && finalDescriptionEn) {
        finalDescription = await translateToGerman(finalDescriptionEn);
      }

      // Fallback: use the other language if one is missing
      if (!finalTitleEn) finalTitleEn = finalTitle;
      if (!finalDescriptionEn) finalDescriptionEn = finalDescription;
      if (!finalTitle) finalTitle = finalTitleEn;
      if (!finalDescription) finalDescription = finalDescriptionEn;

      // Ensure we have non-empty values for required fields
      if (!finalTitle || !finalTitle.trim()) {
        alert('Title is required');
        return;
      }
      if (!finalTitleEn || !finalTitleEn.trim()) {
        finalTitleEn = finalTitle;
      }
      if (!finalDescription || !finalDescription.trim()) {
        finalDescription = '';
      }
      if (!finalDescriptionEn || !finalDescriptionEn.trim()) {
        finalDescriptionEn = finalDescription || '';
      }

      // Ensure date is in YYYY-MM-DD format (HTML date input should already be in this format)
      let formattedDate = editFormData.date;
      if (formattedDate && formattedDate.includes('/')) {
        // Convert MM/DD/YYYY to YYYY-MM-DD
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }

      // Ensure all required fields have valid values (never empty strings for required fields)
      const updatedEventData: any = {
        title: finalTitle.trim(),
        title_en: (finalTitleEn.trim() || finalTitle.trim()), // Fallback to title if empty
        description: (finalDescription.trim() || ''),
        description_en: (finalDescriptionEn.trim() || finalDescription.trim() || ''), // Fallback to description if empty
        date: formattedDate,
      };
      
      // Only include time if it's provided and not empty
      if (editFormData.time && editFormData.time.trim()) {
        updatedEventData.time = editFormData.time.trim();
      }
      
      // Remove any undefined or null values
      Object.keys(updatedEventData).forEach(key => {
        if (updatedEventData[key] === undefined || updatedEventData[key] === null) {
          delete updatedEventData[key];
        }
      });
      
      // Validate required fields before sending
      if (!updatedEventData.title || !updatedEventData.title_en || !updatedEventData.date) {
        console.error('Missing required fields:', updatedEventData);
        alert('Missing required fields. Please check title and date.');
        return;
      }
      
      console.log('Final update data (cleaned):', JSON.stringify(updatedEventData, null, 2));

      const eventId = String(editingEvent.id);
      console.log('Updating event ID:', eventId, 'with data:', updatedEventData);
      
      let updated = await eventService.updateEvent(eventId, updatedEventData);
      
      // If update fails, try with only basic fields (in case _en columns don't exist)
      if (!updated) {
        console.log('First update attempt failed, trying with basic fields only...');
        const basicUpdateData = {
          title: updatedEventData.title,
          description: updatedEventData.description,
          date: updatedEventData.date,
        };
        if (updatedEventData.time) {
          basicUpdateData.time = updatedEventData.time;
        }
        updated = await eventService.updateEvent(eventId, basicUpdateData);
      }

      if (updated) {
        console.log('Event updated successfully:', updated);
        // Reload all events from Supabase to ensure consistency
        const allEvents = await eventService.getAllEvents();
        console.log('Reloaded events:', allEvents);
        const formattedEvents: Event[] = allEvents.map(event => {
          // Handle both snake_case and camelCase field names from Supabase
          const title = (event as any).title || '';
          const titleEn = (event as any).title_en || (event as any).titleEn || title || '';
          const description = (event as any).description || '';
          const descriptionEn = (event as any).description_en || (event as any).descriptionEn || description || '';
          
          return {
            id: event.id,
            title: title,
            titleEn: titleEn,
            description: description,
            descriptionEn: descriptionEn,
            date: event.date,
            time: event.time,
            image: event.image,
          };
        });
        console.log('Formatted events:', formattedEvents);
        setDynamicEvents(formattedEvents);
        setEditingEvent(null);
        setEditFormData({});
      } else {
        console.error('Update failed - eventService.updateEvent returned null');
        alert('Failed to update event. Please check the console for details. The database might need the translation columns (title_en, description_en) to be added.');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert(`An error occurred while updating the event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // All events are loaded from Supabase
  const allEvents: Event[] = [...dynamicEvents].sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  const formatDate = (dateString: string) => {
    if (dateString === 'Available Daily' || dateString === 'Monday - Friday' || dateString === 'Ongoing') {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#410704]">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-32 flex items-center justify-center overflow-hidden min-h-[500px]"
      >
        {/* Elegant Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: 'url(/interior/DSC04026.jpeg)'
          }}
        ></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar scrolled={scrolled} />
        </div>

        {/* Content */}
        <div className={`relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto transition-all duration-1000 ${
          heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-6 px-2">
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase break-words text-center">
              {t('events.hero.subtitle')}
            </span>
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#F5E6D3] mb-6 px-2 break-words leading-tight">
            {t('events.hero.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
          
          <p className="text-sm md:text-base lg:text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed px-4 md:px-2 lg:px-0 break-words">
            {t('events.hero.description')}
          </p>
        </div>
      </section>

      {/* Services Section - Image on left, 3 items on right */}
      <section ref={servicesRef} className="py-24 px-6 bg-[#410704]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image on left */}
            <div className={`relative transition-all duration-1000 delay-300 ${
              servicesInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="w-full aspect-square md:h-[600px] md:aspect-auto rounded-lg overflow-hidden">
                <img
                  src="/interior/image.png"
                  alt="Restaurant Services"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.error('Failed to load image:', '/interior/image.png');
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute -top-2 -left-2 md:-top-6 md:-left-6 w-full h-full border border-[#C7A454] md:border-2 rounded-lg -z-10"></div>
            </div>

            {/* 3 items on right - styled like Experience section */}
            <div className="space-y-8">
              {/* Wine Evenings & Special Promotions */}
              <div className={`flex items-start gap-6 group transition-all duration-1000 ${
                servicesInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`} style={{ transitionDelay: '100ms' }}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="ri-goblet-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                    {t('events.services.wineEvents.title')}
                  </h3>
                  <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                    {t('events.services.wineEvents.description')}
                  </p>
                </div>
              </div>

              {/* Exclusive Offers */}
              <div className={`flex items-start gap-6 group transition-all duration-1000 ${
                servicesInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`} style={{ transitionDelay: '200ms' }}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="ri-star-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                    {t('events.services.exclusiveOffers.title')}
                  </h3>
                  <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                    {t('events.services.exclusiveOffers.description')}
                  </p>
                </div>
              </div>

              {/* Seasonal Updates */}
              <div className={`flex items-start gap-6 group transition-all duration-1000 ${
                servicesInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`} style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="ri-calendar-check-line text-3xl text-[#C7A454] group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#F5E6D3] mb-2">
                    {t('events.services.seasonalUpdates.title')}
                  </h3>
                  <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                    {t('events.services.seasonalUpdates.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <Services />

      {/* Events Occurring Section */}
      <section ref={eventsRef} className="py-24 px-6 bg-[#5A0A06]">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            eventsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
              {t('events.occurring')}
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
                {t('events.currentEvents')}
              </span>
              <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {allEvents.length > 0 ? (
              allEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative p-8 transition-all duration-700 transform hover:-translate-y-3 ${
                  eventsInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Top-left corner border */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
                
                {/* Bottom-right corner border */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

                {/* Admin action buttons */}
                {user?.isAdmin && event.id && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-[#C7A454] hover:text-[#D4AF37] hover:bg-[#5A0A06] rounded transition-colors"
                      title={t('events.edit')}
                    >
                      <i className="ri-edit-line text-xl"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-[#5A0A06] rounded transition-colors"
                      title={t('events.delete')}
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <h3 className="text-2xl font-serif text-[#F5E6D3] mb-4 text-center min-h-[3rem] flex items-center justify-center">
                    {language === 'de' 
                      ? (event.title || event.titleEn || 'No title') 
                      : (event.titleEn || event.title || 'No title')}
                  </h3>
                  <div className="mb-4 text-center">
                    <span className="text-sm text-[#C7A454] font-medium">
                      {formatDate(event.date || '')}
                    </span>
                    {event.time && (
                      <span className="text-sm text-[#F5E6D3]/70 ml-2">
                        • {event.time}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#F5E6D3]/80 leading-relaxed mb-4 flex-1">
                    {language === 'de' 
                      ? (event.description || event.descriptionEn || 'No description available') 
                      : (event.descriptionEn || event.description || 'No description available')}
                  </p>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#F5E6D3]/60 text-lg">
                  {t('events.noEvents') || 'No events available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-line text-2xl"></i>
        </button>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              setEditingEvent(null);
              setEditFormData({});
            }}
            style={{ zIndex: 100 }}
          ></div>

          <div 
            className="relative z-[101] w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setEditingEvent(null);
                setEditFormData({});
              }}
              className="absolute -top-4 -right-4 w-10 h-10 bg-[#5A0A06] border-2 border-[#C7A454] rounded-full flex items-center justify-center text-[#C7A454] hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300 shadow-lg z-20"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <div className="relative bg-[#5A0A06] rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

              <div className="p-8">
                <h2 className="text-2xl font-serif text-[#C7A454] mb-6">Edit Event</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Title (DE) *</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Title (EN)</label>
                    <input
                      type="text"
                      value={editFormData.titleEn || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, titleEn: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Description (DE)</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Description (EN)</label>
                    <textarea
                      value={editFormData.descriptionEn || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, descriptionEn: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Date *</label>
                    <input
                      type="date"
                      value={editFormData.date || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Time</label>
                    <input
                      type="time"
                      value={editFormData.time || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleUpdateEvent}
                    className="px-8 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    Update Event
                  </button>
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setEditFormData({});
                    }}
                    className="px-8 py-3 bg-[#5A0A06] border-2 border-[#C7A454] text-[#C7A454] font-semibold rounded-md hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setDeleteConfirmEvent(null)}
            style={{ zIndex: 100 }}
          ></div>

          <div 
            className="relative z-[101] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDeleteConfirmEvent(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-[#5A0A06] border-2 border-[#C7A454] rounded-full flex items-center justify-center text-[#C7A454] hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300 shadow-lg z-20"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <div className="relative bg-[#5A0A06] rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

              <div className="p-8 text-center">
                <div className="mb-6">
                  <i className="ri-error-warning-line text-5xl text-red-400 mb-4"></i>
                  <h2 className="text-2xl font-serif text-[#C7A454] mb-2">{t('events.deleteConfirm')}</h2>
                  <p className="text-[#F5E6D3]/80">
                    {t('events.deleteConfirmMessage')} <span className="text-[#C7A454] font-semibold">{deleteConfirmEvent.title}</span>?
                  </p>
                  <p className="text-sm text-[#F5E6D3]/60 mt-2">{t('events.deleteConfirmText')}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={confirmDeleteEvent}
                    disabled={isDeleting}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        {t('events.deleting') || 'Deleting...'}
                      </>
                    ) : (
                      t('events.delete')
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmEvent(null)}
                    disabled={isDeleting}
                    className="px-8 py-3 bg-[#5A0A06] border-2 border-[#C7A454] text-[#C7A454] font-semibold rounded-md hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('events.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
