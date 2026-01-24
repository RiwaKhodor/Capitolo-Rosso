/**
 * Migration utility to move data from localStorage to Supabase
 * Run this once after setting up Supabase to migrate existing data
 */

import { menuService, categoryService } from '../services/menuService';
import { eventService } from '../services/eventService';
import { authService } from '../services/authService';

export async function migrateLocalStorageToSupabase() {
  console.log('Starting migration from localStorage to Supabase...');

  try {
    // 1. Migrate Categories
    console.log('Migrating categories...');
    const categories = JSON.parse(localStorage.getItem('menuCategories') || '[]');
    for (const category of categories) {
      await categoryService.addCategory({
        id: category.id,
        name_de: category.nameDe,
        name_en: category.nameEn,
        icon: category.icon,
      });
    }
    console.log(`Migrated ${categories.length} categories`);

    // 2. Migrate Menu Items
    console.log('Migrating menu items...');
    const staticItems = JSON.parse(localStorage.getItem('staticMenuItems') || '[]');
    const dynamicItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const allItems = [...staticItems, ...dynamicItems];
    
    for (const item of allItems) {
      await menuService.addItem({
        nr: item.nr,
        name: item.name,
        name_en: item.nameEn,
        description: item.description,
        description_en: item.descriptionEn,
        allergens: item.allergens || '–',
        price: item.price,
        category_id: item.category,
      });
    }
    console.log(`Migrated ${allItems.length} menu items`);

    // 3. Migrate Events
    console.log('Migrating events...');
    const staticEvents = JSON.parse(localStorage.getItem('staticEvents') || '[]');
    const dynamicEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const allEvents = [...staticEvents, ...dynamicEvents];
    
    for (const event of allEvents) {
      await eventService.addEvent({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        image: event.image,
      });
    }
    console.log(`Migrated ${allEvents.length} events`);

    // 4. Migrate Users (optional - be careful with passwords)
    console.log('Migrating users...');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    for (const user of users) {
      if (user.email && user.password) {
        await authService.register(user.email, user.password, user.name);
      }
    }
    console.log(`Migrated ${users.length} users`);

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Helper function to run migration from browser console
// Call: window.migrateToSupabase()
if (typeof window !== 'undefined') {
  (window as any).migrateToSupabase = migrateLocalStorageToSupabase;
}
