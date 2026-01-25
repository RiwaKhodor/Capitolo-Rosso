import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { menuService, categoryService } from '../../services/menuService';
import { eventService } from '../../services/eventService';
import { MenuItem as SupabaseMenuItem, MenuCategory as SupabaseCategory } from '../../lib/supabase';

interface MenuItem {
  id: string;
  nr: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  allergens: string;
  price: string;
  category: string;
}

interface MenuCategory {
  id: string;
  nameDe: string;
  nameEn: string;
  icon: string;
}

interface Event {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  time?: string;
  image?: string;
}

export default function Manage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'item' | 'event'>('item');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Menu Item Form
  const [menuItem, setMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    allergens: '–',
    price: '',
    category: 'suppen',
  });


  // Event Form
  const [event, setEvent] = useState<Partial<Event>>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: '',
    time: '',
  });

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
    if (!event.titleEn && !event.descriptionEn) {
      alert('Please enter English text first');
      return;
    }

    const [translatedTitle, translatedDescription] = await Promise.all([
      event.titleEn ? translateToGerman(event.titleEn) : Promise.resolve(''),
      event.descriptionEn ? translateToGerman(event.descriptionEn) : Promise.resolve('')
    ]);

    setEvent({
      ...event,
      title: translatedTitle || event.title,
      description: translatedDescription || event.description,
    });
  };

  const [categories, setCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    // Check if editing item or event from navigation state
    if (location.state?.editItem) {
      setEditingItem(location.state.editItem);
      setActiveTab('item');
      setMenuItem(location.state.editItem);
    }
    if (location.state?.editEvent) {
      setEditingEvent(location.state.editEvent);
      setActiveTab('event');
      setEvent(location.state.editEvent);
    }

    // Load categories from Supabase
    const loadCategories = async () => {
      const supabaseCategories = await categoryService.getAllCategories();
      if (supabaseCategories.length > 0) {
        // Convert Supabase format to component format
        const formattedCategories: MenuCategory[] = supabaseCategories.map(cat => ({
          id: cat.id,
          nameDe: cat.name_de,
          nameEn: cat.name_en,
          icon: cat.icon,
        }));
        setCategories(formattedCategories);
      }
    };
    loadCategories();
  }, [user, navigate, location.state]);

  // Helper function to parse price string to number
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    // Remove all non-digit characters except comma and dot
    const cleaned = priceStr.replace(/[^\d,.]/g, '');
    // Replace comma with dot for decimal parsing
    const normalized = cleaned.replace(',', '.');
    const parsed = parseFloat(normalized);
    // Return 0 if parsing fails, otherwise return the parsed number
    return isNaN(parsed) ? 0 : parsed;
  };

  // Function to renumber all items in a category based on price (sequential numbering)
  const renumberCategoryItems = async (category: string) => {
    const allItems = await menuService.getItemsByCategory(category);
    
    // Sort by price
    const sortedItems = [...allItems].sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      return priceA - priceB;
    });
    
    // Prepare batch updates - only update items that need renumbering
    const batchUpdates = sortedItems
      .map((item, index) => {
        const newNr = index + 1;
        if (item.nr !== newNr) {
          return {
            id: item.id,
            updates: { nr: newNr } as Partial<SupabaseMenuItem>
          };
        }
        return null;
      })
      .filter((update): update is { id: string; updates: Partial<SupabaseMenuItem> } => update !== null);
    
    // Execute all updates in parallel for speed
    if (batchUpdates.length > 0) {
      await menuService.batchUpdateItems(batchUpdates);
    }
  };

  // Function to add an item and number it based on its position, incrementing items below globally
  const addItemWithPositionNumbering = async (newItem: Omit<SupabaseMenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    // Get ALL items from ALL categories - IMPORTANT: getAllItems() gets everything
    const allItems = await menuService.getAllItems();
    
    if (allItems.length === 0) {
      // If no items exist, start with number 1
      return 1;
    }
    
    // Sort by current number to maintain global order
    const sortedByNumber = [...allItems].sort((a, b) => a.nr - b.nr);
    
    // Find the position where the new item should be placed based on price
    const newItemPrice = parsePrice(newItem.price);
    let insertPosition = sortedByNumber.length; // Default to end
    
    // Find the first item with a price greater than the new item's price
    for (let i = 0; i < sortedByNumber.length; i++) {
      const itemPrice = parsePrice(sortedByNumber[i].price);
      if (newItemPrice < itemPrice) {
        insertPosition = i;
        break;
      }
    }
    
    // Determine the number the new item should get
    let newItemNumber: number;
    if (insertPosition >= sortedByNumber.length) {
      // Inserting at the end - get max number + 1
      const maxNr = Math.max(...sortedByNumber.map(item => item.nr));
      newItemNumber = maxNr + 1;
    } else {
      // Inserting in the middle - get the number of the item at insertPosition
      newItemNumber = sortedByNumber[insertPosition].nr;
    }
    
    // Increment ALL items globally with numbers >= newItemNumber by 1
    // IMPORTANT: Filter from ALL items (allItems), not just category items
    const itemsToUpdate = allItems.filter(item => item.nr >= newItemNumber);
    
    if (itemsToUpdate.length > 0) {
      // Prepare batch updates - update all items in parallel for speed
      const batchUpdates = itemsToUpdate.map(item => ({
        id: item.id,
        updates: { nr: item.nr + 1 } as Partial<SupabaseMenuItem>
      }));
      
      // Execute all updates in parallel
      await menuService.batchUpdateItems(batchUpdates);
    }
    
    return newItemNumber;
  };

  const handleAddMenuItem = async () => {
    if (!menuItem.name || !menuItem.price || !menuItem.category) {
      alert(t('manage.error'));
      return;
    }
    
    if (editingItem && editingItem.id) {
      // Update existing item
      const oldCategory = editingItem.category;
      const newCategory = menuItem.category!;
      const categoryChanged = oldCategory !== newCategory;
      
      if (categoryChanged) {
        // Renumber old category first
        await renumberCategoryItems(oldCategory);
      }
      
      // Update the item in Supabase
      const updated = await menuService.updateItem(editingItem.id, {
        name: menuItem.name!,
        name_en: menuItem.nameEn || menuItem.name!,
        description: menuItem.description || '',
        description_en: menuItem.descriptionEn || menuItem.description || '',
        allergens: menuItem.allergens || '–',
        price: menuItem.price!,
        category_id: newCategory,
      });
      
      if (updated) {
        // Renumber new category
        await renumberCategoryItems(newCategory);
        alert('Menu item updated successfully!');
      } else {
        alert('Failed to update menu item');
      }
    } else {
      // Add new item
      const newItemData: Omit<SupabaseMenuItem, 'id' | 'created_at' | 'updated_at'> = {
        nr: 0, // Will be set by addItemWithPositionNumbering
        name: menuItem.name!,
        name_en: menuItem.nameEn || menuItem.name!,
        description: menuItem.description || '',
        description_en: menuItem.descriptionEn || menuItem.description || '',
        allergens: menuItem.allergens || '–',
        price: menuItem.price!,
        category_id: menuItem.category!,
      };
      
      // Get the correct number based on position
      const correctNr = await addItemWithPositionNumbering(newItemData);
      newItemData.nr = correctNr;
      
      // Add the item to Supabase
      const added = await menuService.addItem(newItemData);
      
      if (added) {
        alert('Menu item added successfully!');
      } else {
        alert('Failed to add menu item');
      }
    }

    // Reset form
    setMenuItem({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      allergens: '–',
      price: '',
      category: 'suppen',
    });
    setEditingItem(null);
  };


  const handleAddEvent = async () => {
    if (!event.titleEn || !event.descriptionEn || !event.date) {
      alert('Please fill in English title, description, and date');
      return;
    }

    // Auto-translate if German fields are empty
    let finalTitle = event.title;
    let finalDescription = event.description;
    
    if (!finalTitle && event.titleEn) {
      finalTitle = await translateToGerman(event.titleEn);
    }
    if (!finalDescription && event.descriptionEn) {
      finalDescription = await translateToGerman(event.descriptionEn);
    }
    
    if (editingEvent && editingEvent.id) {
      // Update existing event
      const updated = await eventService.updateEvent(editingEvent.id, {
        title: finalTitle || event.title!,
        title_en: event.titleEn!,
        description: finalDescription || event.description!,
        description_en: event.descriptionEn!,
        date: event.date!,
        time: event.time || undefined,
      });
      
      if (updated) {
        alert(t('manage.success'));
      } else {
        alert('Failed to update event');
      }
    } else {
      // Add new event
      const eventData = {
        title: finalTitle || event.titleEn!,
        title_en: event.titleEn!,
        description: finalDescription || event.descriptionEn!,
        description_en: event.descriptionEn!,
        date: event.date!,
        time: event.time || undefined,
      };
      
      console.log('Attempting to add event with data:', eventData);
      
      const added = await eventService.addEvent(eventData);
      
      if (added) {
        alert(t('manage.success'));
        console.log('Event added successfully:', added);
      } else {
        console.error('Failed to add event. Check console for details.');
        alert('Failed to add event. Please check the browser console for details.');
      }
    }

    // Reset form
    setEvent({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      date: '',
      time: '',
    });
    setEditingEvent(null);
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#410704]">
      <Navbar scrolled={true} />
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Elegant Background - Same as About Page */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 object-top"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=Luxurious%20Italian%20restaurant%20interior%20with%20elegant%20table%20settings%20crystal%20chandeliers%20warm%20golden%20lighting%20burgundy%20velvet%20chairs%20and%20sophisticated%20ambiance%20creating%20perfect%20dining%20atmosphere%20for%20special%20occasions&width=1920&height=1000&seq=reservation-hero-bg-001&orientation=landscape)'
          }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
              {t('manage.title')}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab('item')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'item'
                  ? 'bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704]'
                  : 'bg-[#5A0A06] text-[#F5E6D3] border border-[#C7A454]/30'
              }`}
            >
              {t('manage.addItem')}
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'event'
                  ? 'bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704]'
                  : 'bg-[#5A0A06] text-[#F5E6D3] border border-[#C7A454]/30'
              }`}
            >
              {t('manage.addEvent')}
            </button>
          </div>

          {/* Menu Item Form */}
          {activeTab === 'item' && (
            <div className="relative bg-[#5A0A06] p-8 rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden">
              {/* Top-left corner border */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
              
              {/* Bottom-right corner border */}
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

              <h2 className="text-2xl font-serif text-[#C7A454] mb-6">
                {editingItem ? t('manage.editItem') : t('manage.addItem')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemName')} *</label>
                  <input
                    type="text"
                    value={menuItem.name}
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemNameEn')}</label>
                  <input
                    type="text"
                    value={menuItem.nameEn}
                    onChange={(e) => setMenuItem({ ...menuItem, nameEn: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemDescription')}</label>
                  <textarea
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemDescriptionEn')}</label>
                  <textarea
                    value={menuItem.descriptionEn}
                    onChange={(e) => setMenuItem({ ...menuItem, descriptionEn: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemCategory')} *</label>
                  <select
                    value={menuItem.category}
                    onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameDe} / {cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemAllergens')}</label>
                  <input
                    type="text"
                    value={menuItem.allergens}
                    onChange={(e) => setMenuItem({ ...menuItem, allergens: e.target.value })}
                    placeholder="e.g., G,J or –"
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.itemPrice')} *</label>
                  <input
                    type="text"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                    placeholder="e.g., 12,90 €"
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
              </div>
              <button
                onClick={handleAddMenuItem}
                className="mt-6 px-8 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300"
              >
                {editingItem ? t('manage.update') : t('manage.add')}
              </button>
              {editingItem && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setMenuItem({
                      name: '',
                      nameEn: '',
                      description: '',
                      descriptionEn: '',
                      allergens: '–',
                      price: '',
                      category: 'suppen',
                    });
                  }}
                  className="mt-4 px-8 py-3 bg-[#5A0A06] border-2 border-[#C7A454] text-[#C7A454] font-semibold rounded-md hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          )}

          {/* Event Form */}
          {activeTab === 'event' && (
            <div className="relative bg-[#5A0A06] p-8 rounded-lg border border-[#C7A454]/20 shadow-2xl overflow-hidden">
              {/* Top-left corner border */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C7A454]"></div>
              
              {/* Bottom-right corner border */}
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C7A454]"></div>

              <h2 className="text-2xl font-serif text-[#C7A454] mb-6">
                {editingEvent ? t('manage.editEvent') : t('manage.addEvent')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventTitle')} (EN) *</label>
                  <input
                    type="text"
                    value={event.titleEn || ''}
                    onChange={(e) => setEvent({ ...event, titleEn: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventTitle')} (DE) - Auto-translated</label>
                  <input
                    type="text"
                    value={event.title || ''}
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    placeholder="Will be auto-translated from English"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventDate')} *</label>
                  <input
                    type="date"
                    value={event.date || ''}
                    onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventTime')}</label>
                  <input
                    type="time"
                    value={event.time || ''}
                    onChange={(e) => setEvent({ ...event, time: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventDescription')} (EN) *</label>
                  <textarea
                    value={event.descriptionEn || ''}
                    onChange={(e) => setEvent({ ...event, descriptionEn: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5E6D3] mb-2">{t('manage.eventDescription')} (DE) - Auto-translated</label>
                  <textarea
                    value={event.description || ''}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    rows={4}
                    placeholder="Will be auto-translated from English"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleTranslateEvent}
                className="mt-4 px-6 py-2 bg-[#C7A454] hover:bg-[#D4AF37] text-[#410704] font-semibold rounded-md transition-all duration-300 flex items-center gap-2"
              >
                <i className="ri-translate-2-line"></i>
                Translate English to German
              </button>
              <button
                onClick={handleAddEvent}
                className="mt-6 px-8 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300"
              >
                {editingEvent ? t('manage.update') : t('manage.add')}
              </button>
              {editingEvent && (
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setEvent({
                      title: '',
                      titleEn: '',
                      description: '',
                      descriptionEn: '',
                      date: '',
                      time: '',
                    });
                  }}
                  className="mt-4 px-8 py-3 bg-[#5A0A06] border-2 border-[#C7A454] text-[#C7A454] font-semibold rounded-md hover:bg-[#C7A454] hover:text-[#410704] transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
