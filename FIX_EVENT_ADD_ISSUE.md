# Fix: Events Not Being Added

## The Problem

Events are not being added because the database is missing the `title_en` and `description_en` columns. The code tries to insert these columns, but they don't exist in your Supabase database.

## ✅ Solution: Run the Migration

You need to add the missing columns to your `events` table in Supabase.

### Step 1: Go to Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this entire SQL script into the SQL Editor:

```sql
-- Add German and English fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Update existing events: copy title and description to English fields
-- (assuming existing data is in German, adjust if needed)
UPDATE events 
SET title_en = COALESCE(title_en, title),
    description_en = COALESCE(description_en, description)
WHERE title_en IS NULL OR description_en IS NULL;

-- Make the new fields required (NOT NULL) for future inserts
-- Note: This will fail if there are existing NULL values
-- If it fails, first update all NULL values, then run this:
ALTER TABLE events 
ALTER COLUMN title_en SET NOT NULL,
ALTER COLUMN description_en SET NOT NULL;
```

### Step 3: Click "Run" or Press Ctrl+Enter

The migration will:
- Add `title_en` and `description_en` columns
- Copy existing data to the new columns
- Make them required for future inserts

### Step 4: Test Adding an Event

After running the migration:
1. Go to your admin page (`/manage`)
2. Try adding a new event
3. It should work now!

## 🔍 How to Verify

After running the migration, you can verify the columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;
```

You should see:
- `title` (TEXT, NOT NULL)
- `title_en` (TEXT, NOT NULL) ← Should be here
- `description` (TEXT, NOT NULL)
- `description_en` (TEXT, NOT NULL) ← Should be here
- `date` (DATE, NOT NULL)
- `time` (TEXT, nullable)
- `image` (TEXT, nullable)

## 🚨 If Migration Fails

If the migration fails because of existing NULL values:

1. **First, update existing events:**
```sql
UPDATE events 
SET title_en = COALESCE(title_en, title, 'Untitled'),
    description_en = COALESCE(description_en, description, 'No description')
WHERE title_en IS NULL OR description_en IS NULL;
```

2. **Then make them NOT NULL:**
```sql
ALTER TABLE events 
ALTER COLUMN title_en SET NOT NULL,
ALTER COLUMN description_en SET NOT NULL;
```

## ✅ After Migration

Once the migration is complete:
- Events can be added successfully
- The improved error logging will help debug any future issues
- Check the browser console for detailed error messages if something still fails

---

**The migration file is also available in your project:** `migrate_events_translation.sql`
