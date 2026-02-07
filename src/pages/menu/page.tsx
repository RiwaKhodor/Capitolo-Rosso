import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { menuService, categoryService } from '../../services/menuService';

interface MenuItemData {
  id?: string;
  nr: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  allergens: string;
  price: string;
  category: string;
}

export default function MenuPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [dynamicItems, setDynamicItems] = useState<MenuItemData[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MenuItemData | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MenuItemData>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };

    if (categoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const el = heroRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    // Load categories and menu items from Supabase
    const loadData = async () => {
      try {
        // Load categories
        const supabaseCategories = await categoryService.getAllCategories();
        if (supabaseCategories.length > 0) {
          const formattedCategories = supabaseCategories.map(cat => ({
            id: cat.id,
            nameDe: cat.name_de,
            nameEn: cat.name_en,
            icon: cat.icon,
          }));
          setCategories(formattedCategories);
        }

        // Load all menu items from Supabase
        const allItems = await menuService.getAllItems();
        
        // Convert Supabase format to component format
        const formattedItems: MenuItemData[] = allItems.map(item => ({
          id: item.id,
          nr: item.nr,
          name: item.name,
          nameEn: item.name_en,
          description: item.description,
          descriptionEn: item.description_en,
          allergens: item.allergens,
          price: item.price,
          category: item.category_id,
        }));
        
        setDynamicItems(formattedItems);
      } catch (error) {
        console.error('Error loading menu data:', error);
        // Set empty arrays on error to prevent crash
        setCategories([]);
        setDynamicItems([]);
      }
    };
    
    loadData();
    
    // Listen for storage events to refresh data when changes occur
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteItem = (item: MenuItemData) => {
    setDeleteConfirmItem(item);
  };

  const confirmDeleteItem = async () => {
    if (!deleteConfirmItem?.id || !deleteConfirmItem.nr) return;
    
    const deletedNr = deleteConfirmItem.nr;
    
    const deleted = await menuService.deleteItem(deleteConfirmItem.id);
    if (deleted) {
      // Get all remaining items
      const allItems = await menuService.getAllItems();
      
      // Decrement all items with numbers greater than the deleted item's number
      const itemsToUpdate = allItems.filter(item => item.nr > deletedNr);
      
      if (itemsToUpdate.length > 0) {
        // Prepare batch updates - update all items in parallel for speed
        const batchUpdates = itemsToUpdate.map(item => ({
          id: item.id,
          updates: { nr: item.nr - 1 }
        }));
        
        // Execute all updates in parallel
        await menuService.batchUpdateItems(batchUpdates);
      }
      
      // Reload all items from Supabase
      const updatedItems = await menuService.getAllItems();
      const formattedItems: MenuItemData[] = updatedItems.map(item => ({
        id: item.id,
        nr: item.nr,
        name: item.name,
        nameEn: item.name_en,
        description: item.description,
        descriptionEn: item.description_en,
        allergens: item.allergens,
        price: item.price,
        category: item.category_id,
      }));
      setDynamicItems(formattedItems);
      setDeleteConfirmItem(null);
    }
  };

  const handleEditItem = (item: MenuItemData) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      nameEn: item.nameEn,
      description: item.description,
      descriptionEn: item.descriptionEn,
      allergens: item.allergens,
      price: item.price,
      category: item.category,
    });
  };

  // Function to renumber all items in a category based on price (sequential numbering)
  const renumberCategoryItems = async (category: string) => {
    const allItems = await menuService.getItemsByCategory(category);
    
    // Sort by price
    const sortedItems = [...allItems].sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const priceB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return priceA - priceB;
    });
    
    // Prepare batch updates - only update items that need renumbering
    const batchUpdates = sortedItems
      .map((item, index) => {
        const newNr = index + 1;
        if (item.nr !== newNr) {
          return {
            id: item.id,
            updates: { nr: newNr }
          };
        }
        return null;
      })
      .filter((update): update is { id: string; updates: { nr: number } } => update !== null);
    
    // Execute all updates in parallel for speed
    if (batchUpdates.length > 0) {
      await menuService.batchUpdateItems(batchUpdates);
    }
    
    // Reload items after renumbering
    const reloadedItems = await menuService.getAllItems();
    const formattedItems: MenuItemData[] = reloadedItems.map(item => ({
      id: item.id,
      nr: item.nr,
      name: item.name,
      nameEn: item.name_en,
      description: item.description,
      descriptionEn: item.description_en,
      allergens: item.allergens,
      price: item.price,
      category: item.category_id,
    }));
    setDynamicItems(formattedItems);
  };

  const handleUpdateItem = async () => {
    if (!editingItem?.id || !editFormData.name || !editFormData.price || !editFormData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const itemId = editingItem.id;
    const oldCategory = editingItem.category;
    const newCategory = editFormData.category!;
    const categoryChanged = oldCategory !== newCategory;
    
    if (categoryChanged) {
      // Renumber old category first
      await renumberCategoryItems(oldCategory);
    }
    
    // Update the item in Supabase
    const updated = await menuService.updateItem(itemId, {
      name: editFormData.name!,
      name_en: editFormData.nameEn || editFormData.name!,
      description: editFormData.description || '',
      description_en: editFormData.descriptionEn || editFormData.description || '',
      allergens: editFormData.allergens || '–',
      price: editFormData.price!,
      category_id: newCategory,
    });
    
    if (updated) {
      // Renumber new category
      await renumberCategoryItems(newCategory);
      
      // Reload all items
      const allItems = await menuService.getAllItems();
      const formattedItems: MenuItemData[] = allItems.map(item => ({
        id: item.id,
        nr: item.nr,
        name: item.name,
        nameEn: item.name_en,
        description: item.description,
        descriptionEn: item.description_en,
        allergens: item.allergens,
        price: item.price,
        category: item.category_id,
      }));
      setDynamicItems(formattedItems);
      setEditingItem(null);
      setEditFormData({});
    }
  };

  // Helper function to get and sort items for a category
  const getCategoryItems = (categoryId: string): MenuItemData[] => {
    // Filter items from dynamicItems (which contains all items from Supabase)
    const categoryItems = dynamicItems.filter(item => item.category === categoryId);
    // Sort by price (extract number from price string like "12,90 €" -> 12.90)
    return categoryItems.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const priceB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return priceA - priceB;
    });
  };

  // Menu Item Component - supports both old format (individual props) and new format (item object)
  function MenuItem(props: { item?: MenuItemData, isDynamic?: boolean, nr?: number, name?: string, nameEn?: string, description?: string, descriptionEn?: string, allergens?: string, price?: string }) {
    const { item, isDynamic = false, nr, name, nameEn, description, descriptionEn, allergens, price } = props;
    
    // Use item object if provided, otherwise construct from individual props
    let menuItem: MenuItemData;
    if (item) {
      menuItem = item;
    } else {
      // Construct from individual props (for backward compatibility with old static items)
      menuItem = {
      nr: nr!,
      name: name!,
      nameEn: nameEn!,
      description: description || '',
      descriptionEn: descriptionEn || '',
      allergens: allergens || '–',
      price: price!,
      category: '',
      id: undefined,
    };
    }
    
    const { nr: itemNr, name: itemName, nameEn: itemNameEn, description: itemDesc, descriptionEn: itemDescEn, allergens: itemAllergens, price: itemPrice, id } = menuItem;
    
    return (
      <div className="py-4 border-b border-[#5A0A06] hover:bg-[#5A0A06]/30 transition-colors">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-lg font-serif text-[#F5E6D3] mb-1">{language === 'de' ? itemName : itemNameEn}</h4>
                <p className="text-sm text-[#F5E6D3]/70 leading-relaxed">{language === 'de' ? itemDesc : itemDescEn}</p>
                {itemAllergens !== '–' && (
                  <span 
                    onClick={() => {
                      const legendDiv = document.getElementById('allergen-legend');
                      if (legendDiv) {
                        legendDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-xs text-[#C7A454]/70 mt-1 inline-block cursor-pointer hover:text-[#C7A454] transition-colors"
                  >
                    {language === 'de' ? 'Allergene:' : 'Allergens:'} {itemAllergens}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="md:ml-4 flex items-center gap-4">
            <span className="text-lg font-medium text-[#C7A454]">{itemPrice}</span>
            {user?.isAdmin && id && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditItem(menuItem)}
                  className="p-2 text-[#C7A454] hover:text-[#D4AF37] hover:bg-[#5A0A06] rounded transition-colors"
                  title="Edit"
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <button
                  onClick={() => handleDeleteItem(menuItem)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-[#5A0A06] rounded transition-colors"
                  title="Delete"
                >
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Category navigation data
  const categoryNav = [
    { id: 'suppen', icon: 'ri-bowl-line', nameDe: 'Suppen', nameEn: 'Soups' },
    { id: 'antipasti', icon: 'ri-restaurant-2-line', nameDe: 'Antipasti', nameEn: 'Appetizers' },
    { id: 'salate', icon: 'ri-leaf-line', nameDe: 'Salate', nameEn: 'Salads' },
    { id: 'pasta', icon: 'material-symbols-outlined', iconName: 'dinner_dining', nameDe: 'Pasta', nameEn: 'Pasta' },
    { id: 'tagliatelle-gnocchi', icon: 'ri-restaurant-line', nameDe: 'Tagliatelle & Gnocchi', nameEn: 'Tagliatelle & Gnocchi' },
    { id: 'pizza', icon: 'material-symbols-outlined', iconName: 'local_pizza', nameDe: 'Pizza', nameEn: 'Pizza' },
    { id: 'focaccia', icon: 'ri-bread-line', nameDe: 'Focaccia', nameEn: 'Focaccia' },
    { id: 'fleischgerichte', icon: 'ri-fire-line', nameDe: 'Fleischgerichte', nameEn: 'Meat Dishes' },
    { id: 'entrecote-kalb', icon: 'ri-restaurant-line', nameDe: 'Entrecôte & Kalb', nameEn: 'Entrecôte & Veal' },
    { id: 'leber-hahnchen', icon: 'ri-restaurant-line', nameDe: 'Leber & Hähnchen', nameEn: 'Liver & Chicken' },
    { id: 'fischgerichte', icon: 'ri-anchor-line', nameDe: 'Fischgerichte', nameEn: 'Fish Dishes' },
    { id: 'dessert', icon: 'ri-cake-2-line', nameDe: 'Dessert', nameEn: 'Dessert' },
  ];

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#410704]">
      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-32 flex items-center justify-center overflow-hidden min-h-[500px]">
        {/* Elegant Background - Same as Reservations Page */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 object-top"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=Luxurious%20Italian%20restaurant%20interior%20with%20elegant%20table%20settings%20crystal%20chandeliers%20warm%20golden%20lighting%20burgundy%20velvet%20chairs%20and%20sophisticated%20ambiance%20creating%20perfect%20dining%20atmosphere%20for%20special%20occasions&width=1920&height=1000&seq=reservation-hero-bg-001&orientation=landscape)'
          }}
        ></div>
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar scrolled={scrolled} />
        </div>

        {/* Content */}
        <div ref={heroRef} className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('menu.hero.subtitle')}
            </span>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-[#F5E6D3] mb-6">
            {t('menu.hero.subtitle')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] mx-auto mb-8"></div>
          
          <p className="text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed">
            {t('menu.hero.description')}
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 px-6 bg-[#410704]">
        <div className="max-w-6xl mx-auto">
          {/* Category Navigation */}
          <div className="mb-16 bg-[#410704]/95 backdrop-blur-sm py-4 rounded-lg border border-[#C7A454]/20 -mx-6 px-6">
            {/* Desktop: Horizontal Layout */}
            <div className="hidden md:flex flex-nowrap items-center justify-between gap-2">
              {categoryNav.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#5A0A06]/50 hover:bg-[#5A0A06]/70 border border-[#C7A454]/20 hover:border-[#C7A454]/40 transition-all duration-300 whitespace-nowrap flex-1 min-w-0"
                >
                  {category.id === 'pizza' || category.id === 'pasta' ? (
                    <span 
                      className={`${category.icon} text-[#C7A454] group-hover:text-[#D4AF37] transition-colors text-lg flex-shrink-0`}
                      style={{ fontFamily: "'Material Symbols Outlined', sans-serif" }}
                    >
                      {category.iconName}
                    </span>
                  ) : (
                    <i className={`${category.icon} text-[#C7A454] group-hover:text-[#D4AF37] transition-colors text-lg flex-shrink-0`}></i>
                  )}
                  <span className="text-xs font-medium text-[#F5E6D3] group-hover:text-[#C7A454] transition-colors truncate">
                    {language === 'de' ? category.nameDe : category.nameEn}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile: Dropdown Button */}
            <div className="md:hidden relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-md bg-[#5A0A06]/50 hover:bg-[#5A0A06]/70 border border-[#C7A454]/20 hover:border-[#C7A454]/40 transition-all duration-300"
                type="button"
              >
                <span className="text-sm font-medium text-[#F5E6D3]">
                  {language === 'de' ? 'Kategorie auswählen' : 'Select Category'}
                </span>
                <i className={`ri-arrow-down-s-line text-[#C7A454] text-xl transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#5A0A06] border border-[#C7A454]/40 rounded-md shadow-xl z-50 max-h-[400px] overflow-y-auto">
                  {categoryNav.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        scrollToCategory(category.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#410704] transition-colors duration-300 border-b border-[#C7A454]/10 last:border-0"
                      type="button"
                    >
                      {category.id === 'pizza' || category.id === 'pasta' ? (
                        <span 
                          className={`${category.icon} text-[#C7A454] text-lg flex-shrink-0`}
                          style={{ fontFamily: "'Material Symbols Outlined', sans-serif" }}
                        >
                          {category.iconName}
                        </span>
                      ) : (
                        <i className={`${category.icon} text-[#C7A454] text-lg flex-shrink-0`}></i>
                      )}
                      <span className="text-sm font-medium text-[#F5E6D3]">
                        {language === 'de' ? category.nameDe : category.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suppen */}
          <div id="suppen" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-bowl-line text-2xl"></i>
              <span>{language === 'de' ? 'Suppen' : 'Soups'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('suppen').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Antipasti */}
          <div id="antipasti" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-restaurant-2-line text-2xl"></i>
              <span>{language === 'de' ? 'Antipasti' : 'Appetizers'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('antipasti').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Salate */}
          <div id="salate" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-4 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-leaf-line text-2xl"></i>
              <span>{language === 'de' ? 'Salate' : 'Salads'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            <p className="text-sm text-[#F5E6D3]/60 italic mb-6">{language === 'de' ? 'Alle Salate werden wahlweise mit Hausdressing oder Honig-Senf-Dressing serviert.' : 'All salads are served with either house dressing or honey-mustard dressing.'}</p>
            {getCategoryItems('salate').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Pasta */}
          <div id="pasta" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <span 
                className="material-symbols-outlined text-2xl text-[#C7A454]"
                style={{ fontFamily: "'Material Symbols Outlined', sans-serif" }}
              >
                dinner_dining
              </span>
              <span>Pasta</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('pasta').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Tagliatelle & Gnocchi */}
          <div id="tagliatelle-gnocchi" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-restaurant-line text-2xl"></i>
              <span>Tagliatelle & Gnocchi</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('tagliatelle-gnocchi').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Pizza */}
          <div id="pizza" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-4 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <span 
                className="material-symbols-outlined text-2xl text-[#C7A454]"
                style={{ fontFamily: "'Material Symbols Outlined', sans-serif" }}
              >
                local_pizza
              </span>
              <span>Pizza</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            <p className="text-sm text-[#F5E6D3]/60 italic mb-6">{language === 'de' ? 'Alle Pizzen werden mit Tomatensauce und Mozzarella belegt.' : 'All pizzas are topped with tomato sauce and mozzarella.'}</p>
            {getCategoryItems('pizza').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Focaccia */}
          <div id="focaccia" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-bread-line text-2xl"></i>
              <span>Focaccia</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('focaccia').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Fleischgerichte */}
          <div id="fleischgerichte" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-4 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-dinner-line text-3xl text-[#C7A454] flex-shrink-0"></i>
              <span>{language === 'de' ? 'Fleischgerichte' : 'Meat Dishes'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            <p className="text-sm text-[#F5E6D3]/60 italic mb-6">{language === 'de' ? 'Alle Fleischgerichte werden mit Beilagensalat serviert. Alle Fleischgerichte werden medium gegrillt.' : 'All meat dishes are served with side salad. All meat dishes are grilled medium.'}</p>
            {getCategoryItems('fleischgerichte').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Entrecôte & Kalb */}
          <div id="entrecote-kalb" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-restaurant-line text-2xl"></i>
              <span>Entrecôte & Kalb</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            {getCategoryItems('entrecote-kalb').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Leber & Hähnchen */}
          <div id="leber-hahnchen" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-4 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-restaurant-line text-2xl"></i>
              <span>{language === 'de' ? 'Leber & Hähnchen' : 'Liver & Chicken'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            <p className="text-sm text-[#F5E6D3]/60 italic mb-6">{language === 'de' ? 'Alle Leber- und Hähnchengerichte werden mit Beilagensalat serviert.' : 'All liver and chicken dishes are served with side salad.'}</p>
            {getCategoryItems('leber-hahnchen').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Fischgerichte */}
          <div id="fischgerichte" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-4 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-water-line text-3xl text-[#C7A454] flex-shrink-0"></i>
              <span>{language === 'de' ? 'Fischgerichte' : 'Fish Dishes'}</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
            </h3>
            <p className="text-sm text-[#F5E6D3]/60 italic mb-6">{language === 'de' ? 'Alle Fischgerichte werden mit Beilagensalat serviert.' : 'All fish dishes are served with side salad.'}</p>
            {getCategoryItems('fischgerichte').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
                </div>

          {/* Dessert */}
          <div id="dessert" className="mb-16 scroll-mt-24">
            <h3 className="text-3xl font-serif text-[#C7A454] mb-8 pb-3 border-b border-[#C7A454]/30 flex items-center gap-4">
              <i className="ri-cake-2-line text-2xl"></i>
              <span>Dessert</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C7A454] via-[#D4AF37] to-transparent ml-4"></div>
                </h3>
            {getCategoryItems('dessert').map((item) => {
              const isStatic = item.id?.startsWith('static-');
              return (
                <MenuItem key={item.id} item={item} isDynamic={!isStatic} />
              );
            })}
          </div>

          {/* Allergen-Legende */}
          <div id="allergen-legend" className="mb-16 bg-[#5A0A06] p-8 rounded-lg border border-[#C7A454]/20">
            <h3 className="text-2xl font-serif text-[#C7A454] mb-6 pb-3 border-b border-[#C7A454]/30">{language === 'de' ? 'Allergen-Legende (EU 1169/2011)' : 'Allergen Legend (EU 1169/2011)'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#F5E6D3]/90">
              <div><span className="text-[#C7A454] font-medium">A:</span> {language === 'de' ? 'Glutenhaltiges Getreide (Weizen, Roggen, Gerste, Hafer, Dinkel usw.)' : 'Gluten-containing cereals (wheat, rye, barley, oats, spelt, etc.)'}</div>
              <div><span className="text-[#C7A454] font-medium">B:</span> {language === 'de' ? 'Krebstiere' : 'Crustaceans'}</div>
              <div><span className="text-[#C7A454] font-medium">C:</span> {language === 'de' ? 'Eier' : 'Eggs'}</div>
              <div><span className="text-[#C7A454] font-medium">D:</span> {language === 'de' ? 'Fisch' : 'Fish'}</div>
              <div><span className="text-[#C7A454] font-medium">E:</span> {language === 'de' ? 'Erdnüsse' : 'Peanuts'}</div>
              <div><span className="text-[#C7A454] font-medium">F:</span> {language === 'de' ? 'Soja' : 'Soy'}</div>
              <div><span className="text-[#C7A454] font-medium">G:</span> {language === 'de' ? 'Milch und Laktose' : 'Milk and lactose'}</div>
              <div><span className="text-[#C7A454] font-medium">H:</span> {language === 'de' ? 'Schalenfrüchte (Nüsse)' : 'Tree nuts'}</div>
              <div><span className="text-[#C7A454] font-medium">I:</span> {language === 'de' ? 'Sellerie' : 'Celery'}</div>
              <div><span className="text-[#C7A454] font-medium">J:</span> {language === 'de' ? 'Senf' : 'Mustard'}</div>
              <div><span className="text-[#C7A454] font-medium">K:</span> {language === 'de' ? 'Sesam' : 'Sesame'}</div>
              <div><span className="text-[#C7A454] font-medium">L:</span> {language === 'de' ? 'Schwefeldioxid und Sulfite' : 'Sulfur dioxide and sulfites'}</div>
              <div><span className="text-[#C7A454] font-medium">M:</span> {language === 'de' ? 'Lupinen' : 'Lupins'}</div>
              <div><span className="text-[#C7A454] font-medium">N:</span> {language === 'de' ? 'Weichtiere (z. B. Tintenfisch, Muscheln)' : 'Mollusks (e.g. squid, mussels)'}</div>
              </div>
            <p className="mt-6 text-xs text-[#F5E6D3]/70 italic">
              {language === 'de' 
                ? 'Hinweis: Trotz sorgfältiger Zubereitung können Spuren weiterer Allergene durch Kreuzkontamination nicht ausgeschlossen werden. Bei Allergien oder Unverträglichkeiten sprechen Sie bitte vor der Bestellung das Servicepersonal an.'
                : 'Note: Despite careful preparation, traces of other allergens cannot be ruled out due to cross-contamination. If you have allergies or intolerances, please speak to the service staff before ordering.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#5A0A06]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-[#F5E6D3] mb-6">
            {t('menu.hero.cta.title')}
          </h2>
          <p className="text-lg text-[#F5E6D3]/80 mb-8">
            {t('menu.hero.cta.description')}
          </p>
          <button
            onClick={() => {
              navigate('/reservations');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="inline-block px-10 py-4 bg-[#C7A454] text-[#410704] font-semibold rounded-md hover:bg-[#F5E6D3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            {t('menu.hero.cta.button')}
          </button>
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

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              setEditingItem(null);
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
                setEditingItem(null);
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
                <h2 className="text-2xl font-serif text-[#C7A454] mb-6">Edit Menu Item</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Name (DE) *</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Name (EN)</label>
                    <input
                      type="text"
                      value={editFormData.nameEn || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, nameEn: e.target.value })}
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
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Category *</label>
                    <select
                      value={editFormData.category || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
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
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Allergens</label>
                    <input
                      type="text"
                      value={editFormData.allergens || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, allergens: e.target.value })}
                      placeholder="e.g., G,J or –"
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F5E6D3] mb-2">Price *</label>
                    <input
                      type="text"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      placeholder="e.g., 12,90 €"
                      className="w-full px-4 py-2 bg-[#410704] border border-[#C7A454]/30 rounded text-[#F5E6D3]"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleUpdateItem}
                    className="px-8 py-3 bg-gradient-to-b from-[#D4AF37] via-[#C7A454] to-[#B8941F] text-[#410704] font-semibold rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    Update Menu Item
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null);
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
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setDeleteConfirmItem(null)}
            style={{ zIndex: 100 }}
          ></div>

          <div 
            className="relative z-[101] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDeleteConfirmItem(null)}
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
                  <h2 className="text-2xl font-serif text-[#C7A454] mb-2">Confirm Delete</h2>
                  <p className="text-[#F5E6D3]/80">
                    Are you sure you want to delete <span className="text-[#C7A454] font-semibold">{language === 'de' ? deleteConfirmItem.name : deleteConfirmItem.nameEn}</span>?
                  </p>
                  <p className="text-sm text-[#F5E6D3]/60 mt-2">This action cannot be undone.</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={confirmDeleteItem}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all duration-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmItem(null)}
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
    </div>
  );
}
