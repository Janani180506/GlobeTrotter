const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('../models/City');
const Activity = require('../models/Activity');

dotenv.config();

const cities = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 75,
    popularity: 95,
    description: 'The City of Light, known for its art, fashion, and cuisine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    timezone: 'Europe/Paris',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 80,
    popularity: 90,
    description: 'A vibrant metropolis blending tradition and modernity.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    timezone: 'Asia/Tokyo',
  },
  {
    name: 'New York',
    country: 'United States',
    region: 'North America',
    costIndex: 85,
    popularity: 92,
    description: 'The city that never sleeps, a global hub of culture and commerce.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    timezone: 'America/New_York',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: 65,
    popularity: 88,
    description: 'A Mediterranean city famous for its architecture and beaches.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    timezone: 'Europe/Madrid',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    costIndex: 40,
    popularity: 85,
    description: 'A bustling city known for its street food and temples.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    timezone: 'Asia/Bangkok',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    costIndex: 70,
    popularity: 82,
    description: 'A coastal city with iconic landmarks and beautiful beaches.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    timezone: 'Australia/Sydney',
  },
];

const seedCities = async () => {
  try {
    await City.deleteMany({});
    const createdCities = await City.insertMany(cities);
    console.log(`${createdCities.length} cities seeded`);
    return createdCities;
  } catch (error) {
    console.error('Error seeding cities:', error);
  }
};

const seedActivities = async (cities) => {
  const activities = [];

  cities.forEach((city) => {
    if (city.name === 'Paris') {
      activities.push(
        {
          name: 'Eiffel Tower Visit',
          city: city._id,
          type: 'sightseeing',
          description: 'Iconic iron lattice tower offering panoramic city views.',
          cost: 25,
          duration: 120,
          rating: 4.5,
          address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
        },
        {
          name: 'Louvre Museum',
          city: city._id,
          type: 'culture',
          description: 'World-famous art museum home to the Mona Lisa.',
          cost: 17,
          duration: 180,
          rating: 4.8,
          address: 'Rue de Rivoli, 75001 Paris',
        },
        {
          name: 'Seine River Cruise',
          city: city._id,
          type: 'sightseeing',
          description: 'Scenic boat tour along the Seine River.',
          cost: 15,
          duration: 60,
          rating: 4.3,
        }
      );
    } else if (city.name === 'Tokyo') {
      activities.push(
        {
          name: 'Shibuya Crossing',
          city: city._id,
          type: 'sightseeing',
          description: 'The world\'s busiest pedestrian crossing.',
          cost: 0,
          duration: 30,
          rating: 4.2,
        },
        {
          name: 'Sushi Making Class',
          city: city._id,
          type: 'food',
          description: 'Learn to make authentic Japanese sushi.',
          cost: 80,
          duration: 120,
          rating: 4.7,
        },
        {
          name: 'Tokyo Skytree',
          city: city._id,
          type: 'sightseeing',
          description: 'Tallest tower in Japan with observation decks.',
          cost: 20,
          duration: 90,
          rating: 4.4,
        }
      );
    } else if (city.name === 'New York') {
      activities.push(
        {
          name: 'Statue of Liberty',
          city: city._id,
          type: 'sightseeing',
          description: 'Iconic symbol of freedom and democracy.',
          cost: 24,
          duration: 180,
          rating: 4.6,
        },
        {
          name: 'Broadway Show',
          city: city._id,
          type: 'culture',
          description: 'World-class theater performance.',
          cost: 100,
          duration: 150,
          rating: 4.8,
        },
        {
          name: 'Central Park Walk',
          city: city._id,
          type: 'nature',
          description: 'Stroll through the famous urban park.',
          cost: 0,
          duration: 60,
          rating: 4.5,
        }
      );
    }
  });

  try {
    await Activity.deleteMany({});
    const createdActivities = await Activity.insertMany(activities);
    console.log(`${createdActivities.length} activities seeded`);
  } catch (error) {
    console.error('Error seeding activities:', error);
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triptales');
    console.log('MongoDB connected');

    const cities = await seedCities();
    await seedActivities(cities);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

