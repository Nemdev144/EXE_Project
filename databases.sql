-- 2. TOURS TABLE (Stores Static Tour Data)
-- Matches screen: "Tour Nổi Bật" & "Detail"
CREATE TABLE tours (
  id TEXT PRIMARY KEY, -- Manual ID like 'T-MANGDEN-01' is easier for you
  title TEXT NOT NULL,
  location TEXT NOT NULL, -- e.g., "Kon Tum"
  base_price_adult NUMERIC NOT NULL, -- e.g., 2500000
  base_price_child NUMERIC NOT NULL, -- e.g., 891000
  thumbnail_url TEXT, -- The "Stamp" image
  description_short TEXT,
  
  -- Flexible Data (Highlights, Cuisine, Itinerary) goes here as JSON
  details JSONB, 
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SCHEDULES TABLE (Stores Dates & Availability)
-- Matches screen: "Chi tiết đặt chỗ" Calendar
CREATE TABLE tour_schedules (
  id SERIAL PRIMARY KEY,
  tour_id TEXT REFERENCES tours(id),
  start_date DATE NOT NULL, -- e.g., 2025-10-11
  end_date DATE NOT NULL,
  max_slots INT DEFAULT 20,
  booked_slots INT DEFAULT 0, -- Auto-updates when people book
  status TEXT DEFAULT 'available' -- 'available', 'full', 'cancelled'
);