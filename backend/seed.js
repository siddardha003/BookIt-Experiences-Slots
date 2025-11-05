import mongoose from 'mongoose';
import { Experience, ExperienceSchedule } from './db/models.js';
import './db/connection.js';

const sampleExperiences = [
  {
    name: "Kayaking",
    description: "Experience the thrill of kayaking through pristine waters. Our expert guides will lead you through scenic routes while ensuring your safety. All equipment included.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Udupi",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    category: "Water Sports",
    min_age: 12
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Watch the breathtaking sunrise from Nandi Hills. Early morning trek with stunning views of the surrounding landscape. Perfect for photography enthusiasts.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Bangalore",
    price: 899,
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    category: "Trekking",
    min_age: 8
  },
  {
    name: "Coffee Trail",
    description: "Explore the aromatic world of coffee plantations. Learn about coffee cultivation, processing, and enjoy fresh brews. Includes plantation walk and tasting session.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Coorg",
    price: 1299,
    image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
    category: "Plantation Tours",
    min_age: 6
  },
  {
    name: "Kayaking",
    description: "Another beautiful kayaking experience in the waters of Karnataka. Navigate through calm waters with experienced guides.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Udupi, Karnataka",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1527004760525-b1a73b57d5a8?w=400&h=300&fit=crop",
    category: "Water Sports",
    min_age: 12
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Another early morning adventure to catch the magnificent sunrise at Nandi Hills. Includes breakfast and photography guidance.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Bangalore",
    price: 899,
    image_url: "https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=400&h=300&fit=crop",
    category: "Trekking",
    min_age: 8
  },
  {
    name: "Boat Cruise",
    description: "Relaxing boat cruise through scenic waterways. Enjoy the peaceful journey with refreshments and beautiful views.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Sunderban",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: "Water Activities",
    min_age: 5
  },
  {
    name: "Bunjee Jumping",
    description: "Adrenaline-pumping bungee jumping experience with certified instructors. Feel the ultimate thrill with complete safety measures.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Manali",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    category: "Adventure Sports",
    min_age: 18
  },
  {
    name: "Coffee Trail",
    description: "Immerse yourself in the coffee culture of Coorg. Visit plantations, learn about different varieties, and enjoy fresh coffee.",
    short_description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    location: "Coorg",
    price: 1299,
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    category: "Plantation Tours",
    min_age: 6
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Wait for MongoDB connection with timeout
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MongoDB connection timeout'));
      }, 10000); // 10 second timeout

      if (mongoose.connection.readyState === 1) {
        clearTimeout(timeout);
        resolve();
      } else {
        mongoose.connection.once('open', () => {
          clearTimeout(timeout);
          resolve();
        });
        mongoose.connection.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      }
    });

    console.log('✅ Connected to MongoDB');
    console.log('🌱 Starting database seeding...');

    // Clear existing experiences
    await Experience.deleteMany({});
    await ExperienceSchedule.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert new experiences
    const insertedExperiences = await Experience.insertMany(sampleExperiences);
    console.log(`✅ Inserted ${insertedExperiences.length} experiences`);

    // Create some sample schedules for the first few experiences
    const schedules = [];
    const today = new Date();
    
    for (let i = 0; i < Math.min(4, insertedExperiences.length); i++) {
      const experience = insertedExperiences[i];
      
      // Create schedules for the next 7 days
      for (let day = 1; day <= 7; day++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + day);
        
        // Morning slot
        schedules.push({
          experience_id: experience._id,
          date: scheduleDate,
          time: '09:00',
          total_slots: 10,
          slots_available: Math.floor(Math.random() * 10) + 1
        });
        
        // Evening slot
        schedules.push({
          experience_id: experience._id,
          date: scheduleDate,
          time: '16:00',
          total_slots: 8,
          slots_available: Math.floor(Math.random() * 8) + 1
        });
      }
    }

    await ExperienceSchedule.insertMany(schedules);
    console.log(`✅ Inserted ${schedules.length} schedules`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Sample experience IDs:');
    insertedExperiences.slice(0, 3).forEach((exp, index) => {
      console.log(`   ${index + 1}. ${exp.name} (${exp.location}) - ID: ${exp._id}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();