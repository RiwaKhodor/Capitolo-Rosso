import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface MenuItem {
  id: string;
  nr: number;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  allergens: string;
  price: string;
  category_id: string;
  subcategory_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DrinkSubcategory {
  id: string;
  subcategory_nr: number;
  name_de: string;
  name_en: string;
  category_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name_de: string;
  name_en: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  date: string;
  time?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  created_at?: string;
}

