# Supabase Backend Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project Name: `capitolo-rosso`
   - Database Password: (choose a strong password and save it)
   - Region: Choose closest to your users
5. Wait for project to be created (2-3 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

## Step 3: Set Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nr INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  allergens TEXT DEFAULT '–',
  price TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (for admin management)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  google_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_nr ON menu_items(category_id, nr);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, admin write)
-- Menu Categories: Public read, admin write
CREATE POLICY "Menu categories are viewable by everyone"
  ON menu_categories FOR SELECT
  USING (true);

CREATE POLICY "Menu categories are editable by admins"
  ON menu_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.email = auth.jwt() ->> 'email'
      AND app_users.is_admin = true
    )
  );

-- Menu Items: Public read, admin write
CREATE POLICY "Menu items are viewable by everyone"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Menu items are editable by admins"
  ON menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.email = auth.jwt() ->> 'email'
      AND app_users.is_admin = true
    )
  );

-- Events: Public read, admin write
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Events are editable by admins"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.email = auth.jwt() ->> 'email'
      AND app_users.is_admin = true
    )
  );

-- App Users: Users can read their own data, admins can read all
CREATE POLICY "Users can view their own data"
  ON app_users FOR SELECT
  USING (
    auth.jwt() ->> 'email' = email OR
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.email = auth.jwt() ->> 'email'
      AND app_users.is_admin = true
    )
  );

CREATE POLICY "Users can update their own data"
  ON app_users FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- Insert default categories
INSERT INTO menu_categories (id, name_de, name_en, icon) VALUES
  ('suppen', 'Suppen', 'Soups', 'ri-bowl-line'),
  ('antipasti', 'Antipasti', 'Appetizers', 'ri-restaurant-2-line'),
  ('salate', 'Salate', 'Salads', 'ri-leaf-line'),
  ('pasta', 'Pasta', 'Pasta', 'ri-bowl-line'),
  ('tagliatelle-gnocchi', 'Tagliatelle & Gnocchi', 'Tagliatelle & Gnocchi', 'ri-restaurant-line'),
  ('pizza', 'Pizza', 'Pizza', 'ri-cake-3-line'),
  ('focaccia', 'Focaccia', 'Focaccia', 'ri-bread-line'),
  ('fleischgerichte', 'Fleischgerichte', 'Meat Dishes', 'ri-fire-line'),
  ('fischgerichte', 'Fischgerichte', 'Fish Dishes', 'ri-anchor-line'),
  ('dessert', 'Dessert', 'Dessert', 'ri-cake-2-line')
ON CONFLICT (id) DO NOTHING;

-- Create default admin user (password: admin123)
-- Note: In production, use proper password hashing (bcrypt)
-- For now, we'll handle authentication differently
```

## Step 5: Migration Script

After setting up Supabase, you can migrate existing localStorage data by running a migration script (we'll create this).

## Step 6: Update Code

The code has been updated to use Supabase. Make sure to:
1. Restart your dev server after adding environment variables
2. Test adding/editing menu items
3. Test adding/editing events
4. Verify data appears across different browsers/devices

## Notes

- Row Level Security (RLS) is enabled for security
- For production, implement proper password hashing
- Consider using Supabase Auth for better authentication
- The current setup allows public read access (anyone can view menu/events)
- Only authenticated admin users can create/update/delete data
