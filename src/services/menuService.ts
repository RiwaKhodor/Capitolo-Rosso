import { supabase, MenuItem, MenuCategory, DrinkSubcategory } from '../lib/supabase';

// Menu Items
export const menuService = {
  // Get all menu items
  async getAllItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category_id')
      .order('nr');
    
    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
    return data || [];
  },

  // Get menu items by category
  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('nr');
    
    if (error) {
      console.error('Error fetching menu items by category:', error);
      return [];
    }
    return data || [];
  },

  // Add menu item
  async addItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding menu item:', error);
      return null;
    }
    return data;
  },

  // Update menu item
  async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      return null;
    }
    return data;
  },

  // Batch update multiple menu items (for faster renumbering)
  async batchUpdateItems(updates: Array<{ id: string; updates: Partial<MenuItem> }>): Promise<boolean> {
    if (updates.length === 0) return true;
    
    // Use Promise.all to update all items in parallel
    const updatePromises = updates.map(({ id, updates: itemUpdates }) =>
      supabase
        .from('menu_items')
        .update({ ...itemUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
    );
    
    const results = await Promise.all(updatePromises);
    
    // Check if any updates failed
    const hasError = results.some(result => result.error);
    if (hasError) {
      console.error('Error in batch update:', results.find(r => r.error)?.error);
      return false;
    }
    
    return true;
  },

  // Delete menu item
  async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
    return true;
  },
};

// Menu Categories
export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<MenuCategory[]> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data || [];
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<MenuCategory | null> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    return data;
  },

  // Add category
  async addCategory(category: Omit<MenuCategory, 'created_at' | 'updated_at'>): Promise<MenuCategory | null> {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding category:', error);
      return null;
    }
    return data;
  },

  // Update category
  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory | null> {
    const { data, error } = await supabase
      .from('menu_categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      return null;
    }
    return data;
  },

  // Delete category
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    return true;
  },
};

// Drink Subcategories
export const subcategoryService = {
  // Get all subcategories for a category
  async getSubcategoriesByCategory(categoryId: string): Promise<DrinkSubcategory[]> {
    const { data, error } = await supabase
      .from('drink_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('subcategory_nr');
    
    if (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
    return data || [];
  },

  // Get subcategory by ID
  async getSubcategoryById(id: string): Promise<DrinkSubcategory | null> {
    const { data, error } = await supabase
      .from('drink_subcategories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching subcategory:', error);
      return null;
    }
    return data;
  },
};
