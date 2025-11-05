/*
  # Create Experiences Database Schema

  ## Tables Created
    - `experiences`
      - `id` (uuid, primary key) - Unique identifier for each experience
      - `name` (text) - Name of the experience (e.g., "Kayaking", "Boat Cruise")
      - `description` (text) - Full description of the experience
      - `short_description` (text) - Brief summary for listing cards
      - `location` (text) - Location/destination (e.g., "Sunderban")
      - `price` (integer) - Base price in rupees
      - `image_url` (text) - Main image URL
      - `category` (text) - Experience category
      - `min_age` (integer) - Minimum age requirement
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

    - `experience_schedules`
      - `id` (uuid, primary key) - Unique identifier for each schedule slot
      - `experience_id` (uuid, foreign key) - References experiences table
      - `date` (date) - Available date for booking
      - `time` (text) - Time slot (e.g., "9:00 am")
      - `slots_available` (integer) - Number of slots remaining
      - `total_slots` (integer) - Total slots for this time
      - `created_at` (timestamptz) - Timestamp when record was created

  ## Security
    - Enable Row Level Security (RLS) on both tables
    - Add policies for public read access (experiences are publicly viewable)
    - Write access restricted to authenticated users only

  ## Indexes
    - Add index on experience_id for faster schedule lookups
    - Add index on date for schedule queries
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  location text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  image_url text,
  category text DEFAULT 'adventure',
  min_age integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  slots_available integer NOT NULL DEFAULT 0,
  total_slots integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences are publicly viewable"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experiences"
  ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experiences"
  ON experiences
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Schedules are publicly viewable"
  ON experience_schedules
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schedules"
  ON experience_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update schedules"
  ON experience_schedules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_experience_schedules_experience_id 
  ON experience_schedules(experience_id);

CREATE INDEX IF NOT EXISTS idx_experience_schedules_date 
  ON experience_schedules(date);

INSERT INTO experiences (name, description, short_description, location, price, image_url, category, min_age)
VALUES 
  (
    'Kayaking',
    'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking. Scenic routes, trained guides, and safety briefing.',
    'Curated small-group experience. Certified guide. Safety first with gear included.',
    'Sunderban',
    999,
    '/frame-9.png',
    'water-sports',
    10
  ),
  (
    'Boat Cruise',
    'Curated small-group experience. Certified guide. Safety first with gear included. Enjoy a relaxing cruise through scenic waterways.',
    'Curated small-group experience. Certified guide. Safety first with gear included.',
    'Sunderban',
    999,
    '/frame-9-3.png',
    'water-sports',
    5
  );
