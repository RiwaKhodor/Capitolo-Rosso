-- ============================================
-- MENU UPDATE SQL FOR SUPABASE
-- ============================================
-- This script will:
-- 1. Delete all existing menu items
-- 2. Delete all existing menu categories
-- 3. Delete all existing drink subcategories (if table exists)
-- 4. Insert new categories in order
-- 5. Insert drink subcategories (1-13)
-- 6. Insert all menu items in order
-- ============================================

-- Step 1: Delete all existing menu items
DELETE FROM menu_items;

-- Step 1.5: Drop drink_sub_subcategories table if it exists (to avoid foreign key constraint issues)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'drink_sub_subcategories') THEN
    DROP TABLE drink_sub_subcategories CASCADE;
  END IF;
END $$;

-- Step 2: Delete all existing drink subcategories (must be deleted before categories due to foreign key)
DELETE FROM drink_subcategories;

-- Step 3: Delete all existing menu categories
DELETE FROM menu_categories;

-- Step 3.5: Create drink_subcategories table if it doesn't exist
CREATE TABLE IF NOT EXISTS drink_subcategories (
  id TEXT PRIMARY KEY,
  subcategory_nr INTEGER NOT NULL,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES menu_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Step 2.6: Add subcategory_id column to menu_items if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'menu_items' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN subcategory_id TEXT REFERENCES drink_subcategories(id);
  END IF;
END $$;


-- Step 3: Insert Menu Categories (in order)
INSERT INTO menu_categories (id, name_de, name_en, icon) VALUES
('suppen', 'Suppen', 'Soups', 'ri-bowl-line'),
('focaccia', 'Focaccia', 'Focaccia', 'ri-bread-line'),
('antipasti', 'Antipasti', 'Appetizers', 'ri-restaurant-2-line'),
('salate', 'Salate', 'Salads', 'ri-leaf-line'),
('pasta', 'Pasta', 'Pasta', 'material-symbols-outlined'),
('tagliatelle-gnocchi', 'Tagliatelle & Gnocchi', 'Tagliatelle & Gnocchi', 'ri-restaurant-line'),
('pizza', 'Pizza', 'Pizza', 'material-symbols-outlined'),
('fleischgerichte', 'Fleischgerichte', 'Meat Dishes', 'ri-fire-line'),
('hahnchengerichte', 'Hähnchengerichte', 'Chicken Dishes', 'ri-restaurant-line'),
('frischgerichte', 'Frischgerichte', 'Fresh Dishes', 'ri-anchor-line'),
('dessert', 'Dessert', 'Dessert', 'ri-cake-2-line'),
('getranke', 'Getränke', 'Drinks', 'ri-cup-line');

-- Step 4.5: Insert Drink Subcategories (numbered 1-17, but 14-17 display without numbers)
INSERT INTO drink_subcategories (id, subcategory_nr, name_de, name_en, category_id) VALUES
('tee', 1, 'Tee', 'Tea', 'getranke'),
('caffetteria', 2, 'Caffetteria', 'Coffee', 'getranke'),
('limonata', 3, 'Homemade Limonata', 'Homemade Lemonade', 'getranke'),
('bibite', 4, 'Bibite', 'Drinks', 'getranke'),
('aperitivo', 5, 'Aperitivo', 'Aperitifs', 'getranke'),
('cocktails', 6, 'Cocktails', 'Cocktails', 'getranke'),
('bier-vom-fass', 7, 'Bier vom Fass', 'Beer from Tap', 'getranke'),
('bier-flasche', 8, 'Bier (Flasche)', 'Beer (Bottle)', 'getranke'),
('spirituosen', 9, 'Spirituosen', 'Spirits', 'getranke'),
('vini-bianchi', 10, 'Vini Bianchi', 'White Wines', 'getranke'),
('vini-rosato', 11, 'Vini Rosato', 'Rosé Wines', 'getranke'),
('vini-rossi', 12, 'Vini Rossi', 'Red Wines', 'getranke'),
('vino-bottiglia', 13, 'Vino in Bottiglia', 'Wine by the Bottle', 'getranke'),
('vino-bottiglia-weiss', 14, 'Weiss', 'White', 'getranke'),
('vino-bottiglia-rose', 15, 'Rosé', 'Rosé', 'getranke'),
('vino-bottiglia-rot', 16, 'Rot', 'Red', 'getranke'),
('vino-bottiglia-prosecco', 17, 'Prosecco', 'Prosecco', 'getranke');

-- Step 5: Insert Menu Items (in order by category)

-- SUPPEN (Soups) - Items 1-3
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(1, 'CREMA DI POMODORO', 'Tomato Cream Soup', 'Tomatensuppe mit frischem Basilikum und Sahne.', 'Tomato soup with fresh basil and cream.', 'G', '6.90', 'suppen'),
(2, 'MINESTRONE DI VERDURA', 'Vegetable Minestrone', 'Hausgemachte Gemüsesuppe.', 'Homemade vegetable soup.', 'I', '6.90', 'suppen'),
(3, 'ZUPPA DI PESCE', 'Fish Soup', 'Fischsuppe nach sizilianischer Art.', 'Sicilian-style fish soup.', 'B,D,N,L', '12.90', 'suppen');

-- FOCACCIA - Items 4-6
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(4, 'FOCACCIA AL ROSMARINO', 'Rosemary Focaccia', 'Mit Rosmarin, Knoblauch und Oregano.', 'With rosemary, garlic, and oregano.', 'A', '7.90', 'focaccia'),
(5, 'FOCACCIA AL POMODORO', 'Tomato Focaccia', 'Mit Tomaten und frischem Basilikum, Knoblauch und Oregano.', 'With tomatoes and fresh basil, garlic, and oregano.', 'A', '9.90', 'focaccia'),
(6, 'FOCACCIA CON PROSCIUTTO DI PARMA E BUFALA', 'Focaccia with Parma Ham and Buffalo Mozzarella', 'Büffelmozzarella, Knoblauch, Oregano und Parmaschinken.', 'Buffalo mozzarella, garlic, oregano, and Parma ham.', 'A,G', '15.90', 'focaccia');

-- ANTIPASTI (Appetizers) - Items 7-13
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(7, 'BRUSCHETTA', 'Bruschetta', 'Geröstetes Brot mit frischen Tomaten, Knoblauch, Basilikum und Oregano.', 'Toasted bread with fresh tomatoes, garlic, basil, and oregano.', 'A', '5.90', 'antipasti'),
(8, 'MOZZARELLA DI BUFALA CON BASILICO', 'Buffalo Mozzarella with Basil', 'Frische Tomaten mit italienischem Büffelmozzarella und Basilikumpesto.', 'Fresh tomatoes with Italian buffalo mozzarella and basil pesto.', 'G,H', '11.90', 'antipasti'),
(9, 'VITELLO TONNATO', 'Veal with Tuna Sauce', 'Kalbfleisch mit Thunfischsauce, Kapern, Rucola und Kirschtomaten.', 'Veal with tuna sauce, capers, arugula, and cherry tomatoes.', 'C,D', '15.90', 'antipasti'),
(10, 'CARPACCIO DI MANZO', 'Beef Carpaccio', 'Hauchdünne Scheiben vom Rinderfilet mit Rucola, Kirschtomaten und Parmesan.', 'Thinly sliced beef fillet with arugula, cherry tomatoes, and Parmesan.', 'G', '13.90', 'antipasti'),
(11, 'ANTIPASTI DI VERDURA (FÜR 2 PERSONEN)', 'Vegetable Antipasti (For 2 People)', 'Gegrilltes Gemüse der Saison.', 'Grilled seasonal vegetables.', '–', '18.90', 'antipasti'),
(12, 'ANTIPASTI DI CAPITOLO (FÜR 2 PERSONEN)', 'Capitolo Antipasti (For 2 People)', 'Carpaccio, Vitello Tonnato, Büffelmozzarella, pikante Salami, Oliven und gegrilltes Gemüse.', 'Carpaccio, Vitello Tonnato, buffalo mozzarella, spicy salami, olives, and grilled vegetables.', 'C,D,G', '33.90', 'antipasti'),
(13, 'CALAMARETTI SU RUCOLA', 'Calamari on Arugula', 'Calamari auf Rucola.', 'Calamari on arugula.', 'N', '13.90', 'antipasti');

-- SALATE (Salads) - Items 14-21
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(14, 'INSALATA MISTA', 'Mixed Salad', 'Gemischter Salat mit Gurken und Tomaten. Hausdressing.', 'Mixed salad with cucumbers and tomatoes. House dressing.', 'J', '6.90', 'salate'),
(15, 'INSALATA DI POMODORO E CIPOLLA', 'Tomato and Onion Salad', 'Tomatensalat mit Zwiebeln und Oregano.', 'Tomato salad with onions and oregano.', 'J', '8.90', 'salate'),
(16, 'INSALATA NIZZA', 'Nicoise Salad', 'Gemischter Salat. Thunfisch, Sardellen, Ei, Oliven, rote Zwiebeln, Artischocken und Hausdressing.', 'Mixed salad. Tuna, anchovies, egg, olives, red onions, artichokes, and house dressing.', 'C,D,J', '13.90', 'salate'),
(17, 'INSALATA CAESAR', 'Caesar Salad', 'Romana-Salat, Croutons, Parmesan und Caesar-Dressing. + Hähnchenbruststreifen +5,50 €.', 'Romaine lettuce, croutons, Parmesan, and Caesar dressing. + Chicken breast strips +5.50 €.', 'A,C,D,G,J', '10.00', 'salate'),
(18, 'INSALATA DI MANZO', 'Beef Salad', 'Gemischter Salat, Orangen-Dressing, Rote Bete, Mango und Rindfleisch fein aufgeschnitten.', 'Mixed salad, orange dressing, beetroot, mango, and thinly sliced beef.', 'J', '15.90', 'salate'),
(19, 'RUCOLA POMODORO E PARMIGIANO', 'Arugula with Tomatoes and Parmesan', 'Rucola mit Kirschtomaten und Parmesan, Granatapfelsauce, Hausdressing.', 'Arugula with cherry tomatoes and Parmesan, pomegranate sauce, house dressing.', 'G,J', '12.90', 'salate'),
(20, 'RUCOLA CON SALMONE', 'Arugula with Salmon', 'Rucola mit Kirschtomaten und Lachsstreifen, Oliven, Zitronensaft.', 'Arugula with cherry tomatoes and salmon strips, olives, lemon juice.', 'D', '14.90', 'salate'),
(21, 'RUCOLA CON GAMBERONI', 'Arugula with Shrimp', 'Rucola mit Kirschtomaten und 4 Garnelen, Oliven, Zitronensaft.', 'Arugula with cherry tomatoes and 4 shrimp, olives, lemon juice.', 'B', '16.90', 'salate');

-- PASTA - Items 22-32
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(22, 'SPAGHETTI NAPOLI', 'Spaghetti Napoli', 'Spaghetti in Tomatensauce.', 'Spaghetti in tomato sauce.', 'A', '11.90', 'pasta'),
(23, 'SPAGHETTI CARBONARA', 'Spaghetti Carbonara', 'Guanciale, Eier und Parmesan.', 'Guanciale, eggs, and Parmesan.', 'A,C,G', '14.90', 'pasta'),
(24, 'SPAGHETTI BOLOGNESE', 'Spaghetti Bolognese', 'Mit italienischer Tomatensoße, Hackfleisch und Petersilie.', 'With Italian tomato sauce, ground meat, and parsley.', 'A', '15.90', 'pasta'),
(25, 'SPAGHETTI PESTO GENOVESE', 'Spaghetti Pesto Genovese', 'Hausgemachtes Basilikumpesto mit Pinienkernen und Parmesan.', 'Homemade basil pesto with pine nuts and Parmesan.', 'A,G,H', '14.90', 'pasta'),
(26, 'SPAGHETTI PUTTANESCA', 'Spaghetti Puttanesca', 'Kirschtomaten, Kapern, Oliven, Sardellen, pikant.', 'Cherry tomatoes, capers, olives, anchovies, spicy.', 'A,D', '14.90', 'pasta'),
(27, 'SPAGHETTI AGLIO E OLIO E PEPERONCINO', 'Spaghetti Aglio e Olio e Peperoncino', 'Nach italienischer Art.', 'Italian style.', 'A', '13.90', 'pasta'),
(28, 'SPAGHETTI CALAMARETTI', 'Spaghetti with Calamari', 'Calamari mit Knoblauch, Zitronen und Petersilie in Weißweinsauce.', 'Calamari with garlic, lemon, and parsley in white wine sauce.', 'A,N,L', '16.90', 'pasta'),
(29, 'SPAGHETTI FRUTTI DI MARE', 'Spaghetti with Seafood', 'Meeresfrüchte in Tomatensauce mit Knoblauch, Zitronen und Petersilie.', 'Seafood in tomato sauce with garlic, lemon, and parsley.', 'A,B,N', '16.90', 'pasta'),
(30, 'PENNE GORGONZOLA', 'Penne with Gorgonzola', 'Gorgonzolasauce mit Parmesan und Petersilie.', 'Gorgonzola sauce with Parmesan and parsley.', 'A,G,H', '14.90', 'pasta'),
(31, 'PENNE CON POLLO', 'Penne with Chicken', 'Mit Hähnchenbrustfilet, weißen Zwiebeln, Knoblauch, Champignons und Tomaten-Sahnesoße.', 'With chicken breast fillet, white onions, garlic, mushrooms, and tomato-cream sauce.', 'A,G', '14.90', 'pasta'),
(32, 'PENNE ALL''ARRABBIATA', 'Penne all''Arrabbiata', 'Knoblauch, Chili und Tomatensauce.', 'Garlic, chili, and tomato sauce.', 'A', '13.90', 'pasta');

-- TAGLIATELLE & GNOCCHI - Items 33-36
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(33, 'TAGLIATELLE SALMONE', 'Tagliatelle with Salmon', 'Tomatensahnesauce, Lachs, Knoblauch, Pfeffer und Petersilie.', 'Tomato-cream sauce, salmon, garlic, pepper, and parsley.', 'A,G', '17.90', 'tagliatelle-gnocchi'),
(34, 'TAGLIATELLE GAMBERONI', 'Tagliatelle with Shrimp', 'Garnelen, Knoblauch, Hummer-Tomatensauce, Chiliöl und Petersilie.', 'Shrimp, garlic, lobster-tomato sauce, chili oil, and parsley.', 'A,B', '17.90', 'tagliatelle-gnocchi'),
(35, 'GNOCCHI GORGONZOLA', 'Gnocchi with Gorgonzola', 'Gorgonzola, Sahne, Petersilie und Parmesan.', 'Gorgonzola, cream, parsley, and Parmesan.', 'A,C,G', '14.90', 'tagliatelle-gnocchi'),
(36, 'TAGLIOLINI AL TARTUFO', 'Tagliolini with Truffle', 'Trüffelpaste, Parmesan und frischer Trüffel.', 'Truffle paste, Parmesan, and fresh truffle.', 'A,G', '24.90', 'tagliatelle-gnocchi');

-- PIZZA - Items 37-54
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(37, 'PIZZA MARGHERITA CON BASILICO', 'Pizza Margherita with Basil', 'Klassisch mit Tomatensauce, Mozzarella und frischem Basilikum.', 'Classic with tomato sauce, mozzarella, and fresh basil.', 'A,G', '11.90', 'pizza'),
(38, 'PIZZA FUNGHI', 'Pizza with Mushrooms', 'Tomatensauce, Mozzarella und frische Pilze.', 'Tomato sauce, mozzarella, and fresh mushrooms.', 'A,G', '12.90', 'pizza'),
(39, 'PIZZA RUCOLA', 'Pizza with Arugula', 'Tomatensauce, Mozzarella, Parmesan, Knoblauch und Rucola.', 'Tomato sauce, mozzarella, Parmesan, garlic, and arugula.', 'A,G', '13.90', 'pizza'),
(40, 'PIZZA VEGETARIANA', 'Vegetarian Pizza', 'Tomatensauce, Mozzarella, gegrilltes Gemüse, Pilze, Rucola und Knoblauch.', 'Tomato sauce, mozzarella, grilled vegetables, mushrooms, arugula, and garlic.', 'A,G', '14.50', 'pizza'),
(41, 'PIZZA RUSTICA', 'Pizza Rustica', 'Mit Tomatensoße, Mozzarella, frischen Tomaten, Oliven, roten Zwiebeln, Oregano und Chiliöl.', 'With tomato sauce, mozzarella, fresh tomatoes, olives, red onions, oregano, and chili oil.', 'A,G', '13.90', 'pizza'),
(42, 'PIZZA CAPRESE', 'Pizza Caprese', 'Mit Tomatensauce, Kirschtomaten, Mozzarella, Basilikum, Olivenöl und Pfeffer.', 'With tomato sauce, cherry tomatoes, mozzarella, basil, olive oil, and pepper.', 'A,G', '14.90', 'pizza'),
(43, 'PIZZA SPINACI E GORGONZOLA', 'Pizza with Spinach and Gorgonzola', 'Mit Tomatensauce, Mozzarella, Spinat und Gorgonzola.', 'With tomato sauce, mozzarella, spinach, and Gorgonzola.', 'A,G', '13.90', 'pizza'),
(44, 'PIZZA QUATTRO FORMAGGI', 'Pizza Four Cheeses', 'Mit Tomatensauce, Mozzarella und vier verschiedenen Käsesorten.', 'With tomato sauce, mozzarella, and four different types of cheese.', 'A,G', '14.90', 'pizza'),
(45, 'PIZZA SALAMI', 'Pizza with Salami', 'Mit Tomatensauce, Mozzarella und Salami.', 'With tomato sauce, mozzarella, and salami.', 'A,G', '12.90', 'pizza'),
(46, 'PIZZA CAPRICCIOSA', 'Pizza Capricciosa', 'Mit Tomatensauce, Mozzarella, gekochtem Schinken, Salami, Pilzen, Artischocken und Sardellen.', 'With tomato sauce, mozzarella, cooked ham, salami, mushrooms, artichokes, and anchovies.', 'A,D,G', '13.90', 'pizza'),
(47, 'PIZZA DIAVOLA', 'Pizza Diavola', 'Mit Tomatensauce, Mozzarella, scharfer Salami, Basilikum und Chiliöl.', 'With tomato sauce, mozzarella, spicy salami, basil, and chili oil.', 'A,G', '14.90', 'pizza'),
(48, 'PIZZA CALZONE', 'Pizza Calzone', 'Mit Tomatensauce, Mozzarella, Pilzen, gekochtem Schinken, Salami und Peperoni.', 'With tomato sauce, mozzarella, mushrooms, cooked ham, salami, and pepperoni.', 'A,G', '14.90', 'pizza'),
(49, 'PIZZA PARMA', 'Pizza with Parma Ham', 'Mit Tomatensauce, Mozzarella, Parmaschinken, Rucola und Parmesan.', 'With tomato sauce, mozzarella, Parma ham, arugula, and Parmesan.', 'A,G', '16.90', 'pizza'),
(50, 'PIZZA CAESAR E POLLO', 'Pizza Caesar with Chicken', 'Mit Caesar-Dressing, Mozzarella, gebratenem Hähnchen, Kirschtomaten, Romana-Salat und Parmesan.', 'With Caesar dressing, mozzarella, fried chicken, cherry tomatoes, romaine lettuce, and Parmesan.', 'A,C,D,G,J', '16.90', 'pizza'),
(51, 'PIZZA TONNO', 'Pizza with Tuna', 'Mit Tomatensauce, Mozzarella, Thunfisch, roten Zwiebeln und Oliven.', 'With tomato sauce, mozzarella, tuna, red onions, and olives.', 'A,D,G', '14.90', 'pizza'),
(52, 'PIZZA SCAMPI', 'Pizza with Shrimp', 'Mit Tomatensauce, Mozzarella, Garnelen, Knoblauch, Petersilie und Rucola.', 'With tomato sauce, mozzarella, shrimp, garlic, parsley, and arugula.', 'A,B,G', '16.90', 'pizza'),
(53, 'PIZZA FRUTTI DI MARE', 'Pizza with Seafood', 'Mit Tomatensauce, Mozzarella, Meeresfrüchten, Knoblauch, Petersilie und Zitrone.', 'With tomato sauce, mozzarella, seafood, garlic, parsley, and lemon.', 'A,B,G,N', '16.90', 'pizza'),
(54, 'PIZZA SALMONE E SPINACI', 'Pizza with Salmon and Spinach', 'Spinat, Mozzarella und Lachsstreifen (Crème fraîche).', 'Spinach, mozzarella, and salmon strips (crème fraîche).', 'A,D,G', '16.90', 'pizza');

-- FLEISCHGERICHTE (Meat Dishes) - Items 55-59
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(55, 'FILETTO DI MANZO ALLA GRIGLIA', 'Grilled Beef Fillet', 'Rinderfilet mit Rosmarinkartoffeln und Gemüse der Saison.', 'Beef fillet with rosemary potatoes and seasonal vegetables.', '–', '38.90', 'fleischgerichte'),
(56, 'FILETTO DI MANZO AL PEPE VERDE', 'Beef Fillet with Green Pepper', 'Rinderfilet in Grünpfeffer-Cremesauce mit Rosmarinkartoffeln und Gemüse der Saison.', 'Beef fillet in green pepper cream sauce with rosemary potatoes and seasonal vegetables.', 'G', '39.90', 'fleischgerichte'),
(57, 'FILETTO DI MANZO DI CAPITOLO', 'Capitolo Beef Fillet', 'Rinderfilet in Thymian-Rotweinsauce mit Rosmarinkartoffeln und Gemüse der Saison.', 'Beef fillet in thyme-red wine sauce with rosemary potatoes and seasonal vegetables.', 'L', '39.90', 'fleischgerichte'),
(58, 'ENTRECÔTE ALLA TOSCANA', 'Entrecôte Tuscan Style', 'Entrecôte in Thymian-Rotweinsauce mit Rosmarinkartoffeln und Gemüse der Saison.', 'Entrecôte in thyme-red wine sauce with rosemary potatoes and seasonal vegetables.', 'L', '38.90', 'fleischgerichte'),
(59, 'ENTRECÔTE ALLA SICILIANA', 'Entrecôte Sicilian Style', 'Entrecôte mit Kapern, Oliven und Tomatensauce, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Entrecôte with capers, olives, and tomato sauce, served with rosemary potatoes and seasonal vegetables.', '–', '38.90', 'fleischgerichte');

-- HÄHNCHENGERICHTE (Chicken Dishes) - Items 60-61
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(60, 'POLLO ALLA SICILIANA', 'Chicken Sicilian Style', 'Hähnchen vom Grill, Kapern und Oliven in pikanter Tomatensauce, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Grilled chicken, capers, and olives in spicy tomato sauce, served with rosemary potatoes and seasonal vegetables.', '–', '23.90', 'hahnchengerichte'),
(61, 'POLLO AL GORGONZOLA', 'Chicken with Gorgonzola', 'Hähnchen vom Grill in Gorgonzolasauce, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Grilled chicken in Gorgonzola sauce, served with rosemary potatoes and seasonal vegetables.', 'G,H', '24.90', 'hahnchengerichte');

-- FRISCHGERICHTE (Fresh Dishes) - Items 62-65
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(62, 'SCAMPI IN PADELLA', 'Shrimp in Pan', 'Scampi, Knoblauch und Kirschtomaten in leichter Tomatensauce mit Weißwein, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Shrimp, garlic, and cherry tomatoes in light tomato sauce with white wine, served with rosemary potatoes and seasonal vegetables.', 'B,L', '25.90', 'frischgerichte'),
(63, 'CALAMARETTI IN PADELLA', 'Small Calamari in Pan', 'Calamari, Knoblauch und Kirschtomaten in leichter Tomatensauce mit Weißwein, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Calamari, garlic, and cherry tomatoes in light tomato sauce with white wine, served with rosemary potatoes and seasonal vegetables.', 'N,L', '25.90', 'frischgerichte'),
(64, 'SALMONE ALLA GRIGLIA', 'Grilled Salmon', 'Lachsfilet vom Grill, Knoblauch und Kirschtomaten in leichter Tomatensauce mit Weißwein, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Grilled salmon fillet, garlic, and cherry tomatoes in light tomato sauce with white wine, served with rosemary potatoes and seasonal vegetables.', 'D', '26.90', 'frischgerichte'),
(65, 'ZANDER FILET', 'Pike-perch Fillet', 'Zander in Zitronensauce, dazu Rosmarinkartoffeln und Gemüse der Saison.', 'Pike-perch in lemon sauce, served with rosemary potatoes and seasonal vegetables.', 'D,H,L', '26.90', 'frischgerichte');

-- DESSERT - Items 66-69
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id) VALUES
(66, 'TIRAMISU', 'Tiramisu', 'Hausgemacht mit Mascarpone und Espresso (ohne Alkohol).', 'Homemade with Mascarpone and Espresso (without alcohol).', 'A,C,G', '7.90', 'dessert'),
(67, 'PANNA COTTA', 'Panna Cotta', 'Hausgemachte Panna Cotta mit Waldfrüchten.', 'Homemade Panna Cotta with forest fruits.', 'G', '7.90', 'dessert'),
(68, 'TARTUFO', 'Tartufo', 'Eis-Dessert (klassisch).', 'Ice-Dessert (classic).', 'G,H', '7.90', 'dessert'),
(69, 'SOUFFLÉ AL CIOCCOLATO', 'Chocolate Soufflé', 'Schokoladensoufflé mit Mango-Passionsfrucht-Sorbet.', 'Chocolate soufflé with mango-passion fruit sorbet.', 'A,C,G', '7.90', 'dessert');

-- GETRÄNKE (Drinks) - Organized by subcategory

-- 1. TEE (Tea) - Items 1-7
-- Note: Tea items don't have descriptions in the menu
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(1, 'DARJEELING (TASSE)', 'Darjeeling (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(2, 'EARL GREY (TASSE)', 'Earl Grey (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(3, 'GREENTEA ASIA (TASSE)', 'Green Tea Asia (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(4, 'HERBAL GARDEN (TASSE)', 'Herbal Garden (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(5, 'CHAMOMILE FLOWER (TASSE)', 'Chamomile Flower (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(6, 'BIO RELAX AYURVITAL (TASSE)', 'Bio Relax Ayurvital (Cup)', '', '', '–', '3.50', 'getranke', 'tee'),
(7, 'FRESH GINGER / MINT / LEMON (TASSE)', 'Fresh Ginger / Mint / Lemon (Cup)', '', '', '–', '5.50', 'getranke', 'tee');

-- 2. CAFFETTERIA (Coffee) - Items 8-16
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(8, 'ESPRESSO (TASSE)', 'Espresso (Cup)', '', '', '–', '2.80', 'getranke', 'caffetteria'),
(9, 'ESPRESSO DOPPIO (TASSE)', 'Espresso Doppio (Cup)', '', '', '–', '3.80', 'getranke', 'caffetteria'),
(10, 'ESPRESSO CORRETTO (TASSE)', 'Espresso Corretto (Cup)', 'Mit Grappa.', 'With grappa.', '–', '4.50', 'getranke', 'caffetteria'),
(11, 'CAPPUCCINO (TASSE)', 'Cappuccino (Cup)', '', '', 'G', '4.00', 'getranke', 'caffetteria'),
(12, 'CAFFÈ AMERICANO (TASSE)', 'Caffè Americano (Cup)', '', '', '–', '3.50', 'getranke', 'caffetteria'),
(13, 'LATTE MACCHIATO (TASSE)', 'Latte Macchiato (Cup)', '', '', 'G', '4.00', 'getranke', 'caffetteria'),
(14, 'HOT CHOCOLATE (TASSE)', 'Hot Chocolate (Cup)', 'Mit Sahne.', 'With cream.', 'G', '4.50', 'getranke', 'caffetteria'),
(15, 'IRISH COFFEE (TASSE)', 'Irish Coffee (Cup)', 'Mit 4 cl Whiskey.', 'With 4 cl whiskey.', '–', '8.50', 'getranke', 'caffetteria');

-- 3. HOMEMADE LIMONATA - Items 17-18
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(17, 'TROPICAL', 'Tropical', 'Maracuja, Cranberry, frische Zitrone & Orange.', 'Passion fruit, Cranberry, fresh lemon & Orange.', '–', '7.00', 'getranke', 'limonata'),
(18, 'APPLE-MINT', 'Apple-Mint', 'Gekühlter Minztee, Apfelsaft, frische Minze & Limette.', 'Chilled mint tea, apple juice, fresh mint & lime.', '–', '7.00', 'getranke', 'limonata');

-- 4. BIBITE (Drinks) - Items 19-32
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(19, 'SAN PELLEGRINO (0,25 L)', 'San Pellegrino (0.25 L)', '', '', '–', '3.50', 'getranke', 'bibite'),
(20, 'SAN PELLEGRINO (0,75 L)', 'San Pellegrino (0.75 L)', '', '', '–', '7.00', 'getranke', 'bibite'),
(21, 'AQUA PANNA (0,25 L)', 'Acqua Panna (0.25 L)', '', '', '–', '3.50', 'getranke', 'bibite'),
(22, 'AQUA PANNA (0,75 L)', 'Acqua Panna (0.75 L)', '', '', '–', '7.00', 'getranke', 'bibite'),
(23, 'FRUIT SPRITZER (0,2 L)', 'Fruit Spritzer (0.2 L)', 'Apfel naturtrüb, Cranberry, Orange, Ananas, Banane, Johannisbeere, Rhabarber, Maracuja, Kirsche.', 'Apple naturally cloudy, Cranberry, Orange, Pineapple, Banana, Currant, Rhubarb, Passion fruit, Cherry.', '–', '3.50', 'getranke', 'bibite'),
(24, 'FRUIT SPRITZER (0,4 L)', 'Fruit Spritzer (0.4 L)', 'Apfel naturtrüb, Cranberry, Orange, Ananas, Banane, Johannisbeere, Rhabarber, Maracuja, Kirsche.', 'Apple naturally cloudy, Cranberry, Orange, Pineapple, Banana, Currant, Rhubarb, Passion fruit, Cherry.', '–', '5.20', 'getranke', 'bibite'),
(25, 'JUICE (0,2 L)', 'Juice (0.2 L)', 'Apfel naturtrüb, Cranberry, Orange, Johannisbeere, Rhabarber, Maracuja.', 'Apple naturally cloudy, Cranberry, Orange, Redcurrant, Rhubarb, Passion fruit.', '–', '3.50', 'getranke', 'bibite'),
(26, 'JUICE (0,4 L)', 'Juice (0.4 L)', 'Apfel naturtrüb, Cranberry, Orange, Johannisbeere, Rhabarber, Maracuja.', 'Apple naturally cloudy, Cranberry, Orange, Redcurrant, Rhubarb, Passion fruit.', '–', '5.80', 'getranke', 'bibite'),
(27, 'COCA COLA/COCA COLA ZERO/SPRITE (0,2 L)', 'Coca Cola/Coca Cola Zero/Sprite (0.2 L)', '', '', '–', '3.00', 'getranke', 'bibite'),
(28, 'COCA COLA/COCA COLA ZERO/SPRITE (0,4 L)', 'Coca Cola/Coca Cola Zero/Sprite (0.4 L)', '', '', '–', '5.00', 'getranke', 'bibite'),
(29, 'FANTA/MEZZO MIX (0,2 L)', 'Fanta/Mezzo Mix (0.2 L)', '', '', '–', '3.00', 'getranke', 'bibite'),
(30, 'FANTA/MEZZO MIX (0,4 L)', 'Fanta/Mezzo Mix (0.4 L)', '', '', '–', '5.00', 'getranke', 'bibite'),
(31, 'SCHWEPPES (0,25 L)', 'Schweppes (0.25 L)', 'Tonic Water, Bitter Lemon, Ginger Ale, Wildberry.', 'Tonic Water, Bitter Lemon, Ginger Ale, Wildberry.', '–', '3.50', 'getranke', 'bibite'),
(32, 'RED BULL (0.2L)', 'Red Bull (0.2L)', 'Natural, Sugar Free, Berry.', 'Natural, Sugar Free, Berry.', '–', '5.00', 'getranke', 'bibite');

-- 5. APERITIVO (Aperitifs) - Items 33-38
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(33, 'CAMPARI SPRITZ/ORANGE/SODA/TONIC (GLAS)', 'Campari Spritz/Orange/Soda/Tonic (Glass)', '', '', '–', '9.50', 'getranke', 'aperitivo'),
(34, 'APEROL SPRITZ (GLAS)', 'Aperol Spritz (Glass)', 'Frizzante, Aperol & Soda.', 'Frizzante, Aperol & Soda.', '–', '9.50', 'getranke', 'aperitivo'),
(35, 'APEROL PASSION FRUIT/RHUBARB (GLAS)', 'Aperol Passion Fruit/Rhubarb (Glass)', 'Frizzante, Aperol, Maracuja oder Rhabarber Nektar.', 'Frizzante, Aperol, passion fruit or rhubarb nectar.', '–', '9.50', 'getranke', 'aperitivo'),
(36, 'LIMONCELLO SPRITZ (GLAS)', 'Limoncello Spritz (Glass)', 'Limoncello, Prosecco & Soda.', 'Limoncello, Prosecco & Soda.', '–', '9.50', 'getranke', 'aperitivo'),
(37, 'HUGO (GLAS)', 'Hugo (Glass)', 'Frizzante, Soda, Limette, Minze & Holunderblütensirup.', 'Frizzante, Soda, Lime, Mint & Elderflower syrup.', '–', '9.50', 'getranke', 'aperitivo'),
(38, 'LILLET TONIC/LEMON/WILDBERRY (GLAS)', 'Lillet Tonic/Lemon/Wildberry (Glass)', 'Lillet blanc mit Tonic Water oder Bitter Lemon.', 'Lillet blanc with Tonic Water or Bitter Lemon.', '–', '9.50', 'getranke', 'aperitivo');

-- 6. COCKTAILS - Items 39-43
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(39, 'MOJITO (GLAS)', 'Mojito (Glass)', 'Weißer Rum, Soda, frische Limetten, brauner Zucker & Minze.', 'White rum, soda, fresh limes, brown sugar & mint.', '–', '10.00', 'getranke', 'cocktails'),
(40, 'MAI TAI (GLAS)', 'Mai Tai (Glass)', 'Weißer Rum, Zucker, Cointreau & Limette.', 'White rum, sugar, Cointreau & lime.', '–', '10.00', 'getranke', 'cocktails'),
(41, 'PINA COLADA (GLAS)', 'Piña Colada (Glass)', 'Weißer Rum, Zucker, Kokoslikör, Ananassaft, Sahne & Kokosmilch.', 'White rum, sugar, coconut liqueur, pineapple juice, cream & coconut milk.', '–', '10.00', 'getranke', 'cocktails'),
(42, 'SEX ON THE BEACH (GLAS)', 'Sex on the Beach (Glass)', 'Vodka, Grenadinesirup, Limettensaft, Orangensaft & Cranberrysaft.', 'Vodka, grenadine syrup, lime juice, orange juice & cranberry juice.', '–', '10.00', 'getranke', 'cocktails'),
(43, 'LONG ISLAND ICE TEA (GLAS)', 'Long Island Ice Tea (Glass)', 'Vodka, weißer Rum, Tequila, Gin, Cointreau, Limettensaft & Cola.', 'Vodka, white rum, tequila, gin, Cointreau, lime juice & cola.', '–', '12.00', 'getranke', 'cocktails');

-- 7. BIER VOM FASS (Beer from Tap) - Items 44-50
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(44, 'BITBURGER PILS (0,3 L)', 'Bitburger Pils (0.3 L)', '', '', '–', '3.90', 'getranke', 'bier-vom-fass'),
(45, 'BITBURGER PILS (0,5 L)', 'Bitburger Pils (0.5 L)', '', '', '–', '5.50', 'getranke', 'bier-vom-fass'),
(46, 'KÖSTRITZER DARK (0,3 L)', 'Köstritzer Dark (0.3 L)', '', '', '–', '4.50', 'getranke', 'bier-vom-fass'),
(47, 'KÖSTRITZER DARK (0,5 L)', 'Köstritzer Dark (0.5 L)', '', '', '–', '5.90', 'getranke', 'bier-vom-fass'),
(48, 'WEIZEN (0.5 L)', 'Weizen (0.5 L)', '', '', '–', '5.50', 'getranke', 'bier-vom-fass'),
(49, 'RADLER (0,3 L)', 'Radler (0.3 L)', 'Sprite/Fanta/Coke (Fass).', 'Sprite/Fanta/Coke (cask soda).', '–', '3.90', 'getranke', 'bier-vom-fass'),
(50, 'RADLER (0,5 L)', 'Radler (0.5 L)', 'Sprite/Fanta/Coke (Fass).', 'Sprite/Fanta/Coke (cask soda).', '–', '5.50', 'getranke', 'bier-vom-fass');

-- 8. BIER (FLASCHE) (Beer Bottle) - Items 51-53
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(51, 'BENEDIKTINER (0,5 L)', 'Benediktiner (0.5 L)', 'Alkoholfrei.', 'Non-alcoholic.', '–', '5.50', 'getranke', 'bier-flasche'),
(52, 'BITBURGER 0,0% (0,33 L)', 'Bitburger 0.0% (0.33 L)', '', '', '–', '4.50', 'getranke', 'bier-flasche'),
(53, 'PERONI NASTRO AZZURRO (0,33 L)', 'Peroni Nastro Azzurro (0.33 L)', '', '', '–', '4.50', 'getranke', 'bier-flasche');

-- 9. SPIRITUOSEN (Spirits) - Items 54-71
-- Note: Most spirits have 2 cl / 4 cl serving sizes with different prices
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(54, 'RAMAZOTTI (2 cl / 4 cl)', 'Ramazzotti (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(55, 'AVERNA (2 cl / 4 cl)', 'Averna (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(56, 'AMARETTO (2 cl / 4 cl)', 'Amaretto (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(57, 'FERNET BRANCA (2 cl / 4 cl)', 'Fernet Branca (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(58, 'WILLIAMSBIRNE (2 cl / 4 cl)', 'Williams Pear (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(59, 'HIMBEERGEIST (2 cl / 4 cl)', 'Raspberry Spirit (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(60, 'KIRSCHWASSER (2 cl / 4 cl)', 'Kirschwasser (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(61, 'JÄGERMEISTER (2 cl / 4 cl)', 'Jägermeister (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(62, 'TEQUILA SILVER (2 cl / 4 cl)', 'Tequila Silver (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(63, 'JACK DANIELS (2 cl / 4 cl)', 'Jack Daniels (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(64, 'GRAPPA (2 cl / 4 cl)', 'Grappa (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(65, 'LIMONCELLO (2 cl / 4 cl)', 'Limoncello (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(66, 'SAMBUCA (2 cl / 4 cl)', 'Sambuca (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(67, 'ABSOLUT VODKA (2 cl / 4 cl)', 'Absolut Vodka (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(68, 'BOMBAY GIN (2 cl / 4 cl)', 'Bombay Gin (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(69, 'HENNESSY (2 cl / 4 cl)', 'Hennessy (2 cl / 4 cl)', '', '', '–', '4.00 / 6.50', 'getranke', 'spirituosen'),
(70, 'GRAPPA AMARENA (2 cl / 4 cl)', 'Grappa Amarena (2 cl / 4 cl)', '', '', '–', '11.80 / 18.00', 'getranke', 'spirituosen'),
(71, 'FILLER', 'Filler', '', '', '–', '3.00', 'getranke', 'spirituosen');

-- 10. VINI BIANCHI (White Wines) - Items 72-75
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(72, 'PINOT GRIGIO (0,2 L)', 'Pinot Grigio (0.2 L)', 'Italien, Nova Ponte, Veneto, besonders frisch & klare Struktur.', 'Italy, Nova Ponte, Veneto, particularly fresh & clear structure.', '–', '7.50', 'getranke', 'vini-bianchi'),
(73, 'SOAVE DOC (0,2 L)', 'Soave DOC (0.2 L)', 'Italien, Veneto, Trocken, sauream, sanft.', 'Italy, Veneto, Dry, slightly acidic, gentle.', '–', '7.00', 'getranke', 'vini-bianchi'),
(74, 'CHARDONNAY DOC (0,2 L)', 'Chardonnay DOC (0.2 L)', 'Italien, Veneto, Trocken, zarten, dezent bluming & elegant.', 'Italy, Veneto, Dry, delicate, subtly floral & elegant.', '–', '7.80', 'getranke', 'vini-bianchi'),
(75, 'FRIZZENTINO (0,2 L)', 'Frizzentino (0.2 L)', 'Italien, Veneto, Perlender, Lieblicher Weißwein.', 'Italy, Veneto, Sparkling, Sweet white wine.', '–', '7.50', 'getranke', 'vini-bianchi');

-- 11. VINI ROSATO (Rosé Wines) - Item 76
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(76, 'BARDOLINO (0,2 L)', 'Bardolino (0.2 L)', 'Italien, Veneto, fruchtiges Bukett mit Veilchen & Rosen, frisch.', 'Italy, Veneto, fruity bouquet with violets & roses, fresh.', '–', '7.50', 'getranke', 'vini-rosato');

-- 12. VINI ROSSI (Red Wines) - Items 77-81
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(77, 'MONTEPULCIANO (0,2 L)', 'Montepulciano (0.2 L)', 'Italien, Abruzzen, Kraftvoll, fruchtig, leichte Tannine, trocken.', 'Italy, Abruzzo, Powerful, fruity, light tannins, dry.', '–', '7.50', 'getranke', 'vini-rossi'),
(78, 'MERLOT (0,2 L)', 'Merlot (0.2 L)', 'Italien, Veneto, Frisch, leicht, dezent und wurzig.', 'Italy, Veneto, Fresh, light, subtle and spicy.', '–', '7.50', 'getranke', 'vini-rossi'),
(79, 'CHIANTI (0,2 L)', 'Chianti (0.2 L)', 'Italien, Toscana, Markent, fruchtig und feinem Veilchen-Bouquet.', 'Italy, Tuscany, Brand, fruity and fine violet bouquet.', '–', '7.50', 'getranke', 'vini-rossi'),
(80, 'NERO D''AVOLA (0,2 L)', 'Nero d''Avola (0.2 L)', 'Italien, Sizilien, Bombeere, Kirsche, Pflaume, rote Johannisbeere.', 'Italy, Sicily, Blackberry, cherry, plum, red currant.', '–', '7.80', 'getranke', 'vini-rossi'),
(81, 'LAMBRUSCO (0,2 L)', 'Lambrusco (0.2 L)', 'Italien, Emilia Romagna, Kraftvoll, fruchtig, leichte Perlung und angenehme Lieblichkeit.', 'Italy, Emilia Romagna, Powerful, fruity, light effervescence and pleasant sweetness.', '–', '7.50', 'getranke', 'vini-rossi');

-- WEISS (White Wines) - Items 82-87
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(82, 'BIANCO DI STELLE GRILLO (0,75 L)', 'Bianco di Stelle Grillo (0.75 L)', 'Italien, Sizilien.', 'Italy, Sicily.', '–', '35.00', 'getranke', 'vino-bottiglia-weiss'),
(83, 'ASCHERI GAVI DI GAVI (0,75 L)', 'Ascheri Gavi di Gavi (0.75 L)', 'Italien, Cortese, Piemont.', 'Italy, Cortese, Piedmont.', '–', '39.80', 'getranke', 'vino-bottiglia-weiss'),
(84, 'VERMENTINO COSTAMOLINO (0,75 L)', 'Vermentino Costamolino (0.75 L)', 'Italien, Sardinien.', 'Italy, Sardinia.', '–', '75.00', 'getranke', 'vino-bottiglia-weiss'),
(85, 'COSTAMOLINO VERMENTINO DOC', 'Costamolino Vermentino DOC', 'Frisch & mineralisch mit Mango, Melone und Zitrus.', 'Fresh & mineral with mango, melon, and citrus.', '–', '38.90', 'getranke', 'vino-bottiglia-weiss'),
(86, 'CÀ DEI FRATI LUGANA DOC', 'Cà dei Frati Lugana DOC', 'Blumig, Aprikose & Birne, elegant mit lebendiger Säure.', 'Floral, apricot & pear, elegant with lively acidity.', '–', '47.90', 'getranke', 'vino-bottiglia-weiss'),
(87, 'REGALEALI BIANCO SICILIA DOC', 'Regaleali Bianco Sicilia DOC', 'Zitrus & Kernobst, fruchtig und angenehm frisch.', 'Citrus & stone fruit, fruity and pleasantly fresh.', '–', '39.90', 'getranke', 'vino-bottiglia-weiss');

-- ROSÉ - Items 88-90
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(88, 'BARDOLINO (0,75 L)', 'Bardolino (0.75 L)', 'Italien, Lungarotti.', 'Italy, Lungarotti.', '–', '35.00', 'getranke', 'vino-bottiglia-rose'),
(89, 'CÀ DEI FRATI ROSA DEI FRATI', 'Cà dei Frati Rosa dei Frati', 'Feinfruchtig, Waldbeeren, mineralisch und erfrischend.', 'Fine fruity, forest berries, mineral and refreshing.', '–', '39.90', 'getranke', 'vino-bottiglia-rose'),
(90, 'REGALEALI ROSÉ TERRE SICILIANE IGT', 'Regaleali Rosé Terre Siciliane IGT', 'Erdbeere & Kirsche, zarte Säure, viel Frucht.', 'Strawberry & cherry, delicate acidity, much fruit.', '–', '39.90', 'getranke', 'vino-bottiglia-rose');

-- ROT (Red Wines) - Items 91-97
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(91, 'NERO D''AVOLA (0,75 L)', 'Nero d''Avola (0.75 L)', 'Italien.', 'Italy.', '–', '37.00', 'getranke', 'vino-bottiglia-rot'),
(92, 'MONTEPULCIANO CASA BORDINO (0,75 L)', 'Montepulciano Casa Bordino (0.75 L)', 'Italien.', 'Italy.', '–', '35.00', 'getranke', 'vino-bottiglia-rot'),
(93, 'CASTEL MAISON MERLOT (0,75 L)', 'Castel Maison Merlot (0.75 L)', 'Italien.', 'Italy.', '–', '33.00', 'getranke', 'vino-bottiglia-rot'),
(94, 'SALICE SALANTINO (0,75 L)', 'Salice Salentino (0.75 L)', 'Italien, trocken.', 'Italy, dry.', '–', '39.00', 'getranke', 'vino-bottiglia-rot'),
(95, 'PRIMITIVO PUGLIA (0,75 L)', 'Primitivo Puglia (0.75 L)', 'Italien, Apulien.', 'Italy, Apulia.', '–', '75.00', 'getranke', 'vino-bottiglia-rot'),
(96, 'REGALEALI NERO D''AVOLA DOC', 'Regaleali Nero d''Avola DOC', 'Pflaume & Kirsche, Vanille, vollmundig mit Struktur.', 'Plum & cherry, vanilla, full-bodied with structure.', '–', '39.90', 'getranke', 'vino-bottiglia-rot'),
(97, 'PRIMITIVO DI MANDURIA', 'Primitivo di Manduria', 'Dunkle Beeren, würzig, kräftig und samtig.', 'Dark berries, spicy, strong and velvety.', '–', '75.00', 'getranke', 'vino-bottiglia-rot');

-- PROSECCO - Items 98-99
INSERT INTO menu_items (nr, name, name_en, description, description_en, allergens, price, category_id, subcategory_id) VALUES
(98, 'PROSECCO (0,2 L)', 'Prosecco (0.2 L)', 'Italien.', 'Italy.', '–', '7.00', 'getranke', 'vino-bottiglia-prosecco'),
(99, 'PROSECCO (0,75 L)', 'Prosecco (0.75 L)', 'Italien.', 'Italy.', '–', '35.00', 'getranke', 'vino-bottiglia-prosecco');


-- ============================================
-- END OF MENU UPDATE
-- ============================================
-- Note: The numbering system uses sequential numbers (nr) 
-- that may not be continuous due to category organization.
-- Items are ordered by category_id and then by nr.
-- ============================================
