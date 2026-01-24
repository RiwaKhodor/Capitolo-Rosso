-- ============================================
-- MIGRATE EVENTS TABLE TO SUPPORT TRANSLATIONS
-- Copy and paste this entire script into Supabase SQL Editor
-- ============================================

-- Add German and English fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Update existing events: copy title and description to English fields
-- (assuming existing data is in German, adjust if needed)
UPDATE events 
SET title_en = title,
    description_en = description
WHERE title_en IS NULL OR description_en IS NULL;

-- Make the new fields required (NOT NULL) for future inserts
ALTER TABLE events 
ALTER COLUMN title_en SET NOT NULL,
ALTER COLUMN description_en SET NOT NULL;

-- Optional: If you want to rename the existing fields to _de for clarity
-- ALTER TABLE events RENAME COLUMN title TO title_de;
-- ALTER TABLE events RENAME COLUMN description TO description_de;
