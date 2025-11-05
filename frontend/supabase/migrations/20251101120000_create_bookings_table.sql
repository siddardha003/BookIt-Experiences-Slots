-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id varchar(50) UNIQUE NOT NULL,
  experience_id uuid NOT NULL REFERENCES experiences(id),
  schedule_id uuid NOT NULL REFERENCES experience_schedules(id),
  full_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  promo_code varchar(50),
  total_amount decimal(10,2) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Allow anonymous booking creation"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_reference_id ON bookings(reference_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON bookings(schedule_id);

-- Add some sample schedules for existing experiences
INSERT INTO experience_schedules (experience_id, date, time, slots_available, total_slots)
SELECT 
  e.id,
  CURRENT_DATE + interval '1 day' * d.day_offset,
  t.time,
  t.slots,
  t.slots
FROM experiences e
CROSS JOIN (
  VALUES 
    (0), (1), (2), (3), (4), (5), (6)
) AS d(day_offset)
CROSS JOIN (
  VALUES 
    ('07:00 am', 4),
    ('09:00 am', 3),
    ('11:00 am', 5),
    ('01:00 pm', 2)
) AS t(time, slots)
WHERE e.name IN ('Kayaking', 'Boat Cruise');