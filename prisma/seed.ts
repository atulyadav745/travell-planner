import { PrismaClient, ActivityType } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();

const parisActivities = [
  {
    name: 'Eiffel Tower',
    description: 'Iconic wrought-iron lattice tower. Climb or take an elevator for panoramic city views.',
    city: 'Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    typicalDuration: 120, // 2 hours
    activityType: ActivityType.LANDMARK,
    priority: 5, // High priority as it's an iconic landmark
    bestTimeOfDay: 'AFTERNOON',
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Louvre Museum',
    description: 'World\'s largest art museum and a historic monument. Home to the Mona Lisa.',
    city: 'Paris',
    latitude: 48.8606,
    longitude: 2.3376,
    typicalDuration: 240, // 4 hours
    activityType: ActivityType.MUSEUM,
    priority: 5,
    bestTimeOfDay: 'MORNING',
    imageUrl: 'https://images.unsplash.com/photo-1544813545-4827b64fcacb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Notre-Dame Cathedral',
    description: 'Medieval Catholic cathedral, widely considered one of the finest examples of French Gothic architecture.',
    city: 'Paris',
    latitude: 48.8530,
    longitude: 2.3499,
    typicalDuration: 60, // 1 hour
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
    imageUrl: 'https://images.unsplash.com/photo-1584721285593-75d5ca7fb85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Arc de Triomphe',
    description: 'Stands at the western end of the Champs-Élysées, honoring those who fought and died for France.',
    city: 'Paris',
    latitude: 48.8738,
    longitude: 2.2950,
    typicalDuration: 45, // 45 minutes
    activityType: ActivityType.LANDMARK,
    priority: 3,
    bestTimeOfDay: 'AFTERNOON',
    imageUrl: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sacre-Coeur Basilica',
    description: 'A Roman Catholic church and minor basilica, dedicated to the Sacred Heart of Jesus.',
    city: 'Paris',
    latitude: 48.8867,
    longitude: 2.3431,
    typicalDuration: 60, // 1 hour
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
    imageUrl: 'https://images.unsplash.com/photo-1595629203418-4581f62aff3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Musée d\'Orsay',
    description: 'Housed in a former railway station, it holds mainly French art dating from 1848 to 1914.',
    city: 'Paris',
    latitude: 48.8600,
    longitude: 2.3265,
    typicalDuration: 150, // 2.5 hours
    activityType: ActivityType.MUSEUM,
    priority: 4,
    bestTimeOfDay: 'AFTERNOON',
    imageUrl: 'https://images.unsplash.com/photo-1587179518496-47977cfc7c8a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sainte-Chapelle',
    description: 'A royal chapel in the Gothic style, with one of the most extensive 13th-century stained glass collections anywhere in the world.',
    city: 'Paris',
    latitude: 48.8554,
    longitude: 2.3450,
    typicalDuration: 45, // 45 minutes
    activityType: ActivityType.LANDMARK,
    priority: 3,
    bestTimeOfDay: 'MORNING',
    imageUrl: 'https://images.unsplash.com/photo-1590459754004-eb2473cd805c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jardin du Luxembourg',
    description: 'Beautiful gardens created in 1612, featuring lawns, tree-lined promenades, flowerbeds, and the picturesque Medici Fountain.',
    city: 'Paris',
    latitude: 48.8462,
    longitude: 2.3372,
    typicalDuration: 90, // 1.5 hours
    activityType: ActivityType.PARK,
    priority: 3,
    bestTimeOfDay: 'AFTERNOON',
    imageUrl: 'https://images.unsplash.com/photo-1589997461746-096f6c787484?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Montmartre',
    description: 'A large hill in Paris\'s 18th arrondissement, known for its artistic history and the white-domed Sacré-Cœur Basilica.',
    city: 'Paris',
    latitude: 48.8867,
    longitude: 2.3431,
    typicalDuration: 180, // 3 hours
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Palace of Versailles',
    description: 'The principal royal residence of France from 1682, under Louis XIV, until the start of the French Revolution in 1789.',
    city: 'Paris', // Technically just outside, but considered a Paris activity
    latitude: 48.8049,
    longitude: 2.1204,
    typicalDuration: 300, // 5 hours
    activityType: ActivityType.LANDMARK,
    priority: 5,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Moulin Rouge',
    description: 'A world-famous cabaret in Paris, France, co-founded in 1889.',
    city: 'Paris',
    latitude: 48.8841,
    longitude: 2.3322,
    typicalDuration: 120, // 2 hours for a show
    activityType: ActivityType.ENTERTAINMENT,
    priority: 3,
    bestTimeOfDay: 'EVENING',
  },
  {
    name: 'Catacombs of Paris',
    description: 'Underground ossuaries which hold the remains of more than six million people in a small part of a tunnel network.',
    city: 'Paris',
    latitude: 48.8338,
    longitude: 2.3324,
    typicalDuration: 60, // 1 hour
    activityType: ActivityType.LANDMARK,
    priority: 3,
    bestTimeOfDay: 'AFTERNOON',
  }
];

const londonActivities = [
  {
    name: 'Tower of London',
    description: 'Historic castle and fortress on the north bank of the River Thames. Home to the Crown Jewels.',
    city: 'London',
    latitude: 51.5081,
    longitude: -0.0759,
    typicalDuration: 180, // 3 hours
    activityType: ActivityType.LANDMARK,
    priority: 5,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'British Museum',
    description: 'World-famous museum of human history and culture, featuring the Rosetta Stone and Egyptian mummies.',
    city: 'London',
    latitude: 51.5194,
    longitude: -0.1269,
    typicalDuration: 240, // 4 hours
    activityType: ActivityType.MUSEUM,
    priority: 5,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Westminster Abbey',
    description: 'Gothic church and UNESCO World Heritage site, hosting royal coronations and burials.',
    city: 'London',
    latitude: 51.4994,
    longitude: -0.1275,
    typicalDuration: 120, // 2 hours
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Buckingham Palace',
    description: 'Official London residence of the British monarch, with ceremonial guard changes.',
    city: 'London',
    latitude: 51.5014,
    longitude: -0.1419,
    typicalDuration: 90, // 1.5 hours
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'London Eye',
    description: 'Giant Ferris wheel offering panoramic views of the city.',
    city: 'London',
    latitude: 51.5033,
    longitude: -0.1195,
    typicalDuration: 60, // 1 hour
    activityType: ActivityType.ENTERTAINMENT,
    priority: 3,
    bestTimeOfDay: 'AFTERNOON',
  }
];

const romeActivities = [
  {
    name: 'Colosseum',
    description: 'Iconic ancient amphitheater, symbol of Imperial Rome.',
    city: 'Rome',
    latitude: 41.8902,
    longitude: 12.4922,
    typicalDuration: 180, // 3 hours
    activityType: ActivityType.LANDMARK,
    priority: 5,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Vatican Museums',
    description: 'Vast museum complex featuring the Sistine Chapel and other masterpieces.',
    city: 'Rome',
    latitude: 41.9067,
    longitude: 12.4526,
    typicalDuration: 240, // 4 hours
    activityType: ActivityType.MUSEUM,
    priority: 5,
    bestTimeOfDay: 'MORNING',
  },
  {
    name: 'Pantheon',
    description: 'Former Roman temple, now a church, featuring the world\'s largest unreinforced concrete dome.',
    city: 'Rome',
    latitude: 41.8986,
    longitude: 12.4769,
    typicalDuration: 60, // 1 hour
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'AFTERNOON',
  },
  {
    name: 'Trevi Fountain',
    description: 'Baroque fountain known for coin-tossing tradition.',
    city: 'Rome',
    latitude: 41.9009,
    longitude: 12.4833,
    typicalDuration: 30, // 30 minutes
    activityType: ActivityType.LANDMARK,
    priority: 3,
    bestTimeOfDay: 'EVENING',
  },
  {
    name: 'Roman Forum',
    description: 'Sprawling ruins of ancient government buildings at the center of Rome.',
    city: 'Rome',
    latitude: 41.8925,
    longitude: 12.4853,
    typicalDuration: 120, // 2 hours
    activityType: ActivityType.LANDMARK,
    priority: 4,
    bestTimeOfDay: 'MORNING',
  }
];

const allActivities = [...parisActivities, ...londonActivities, ...romeActivities];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data to prevent duplicates
  // First delete all scheduled activities that reference activities
  await prisma.scheduledActivity.deleteMany();
  // Then delete the activities
  await prisma.activity.deleteMany();
  console.log('Deleted existing activities');

  for (const a of allActivities) {
    const activity = await prisma.activity.create({
      data: a,
    });
    console.log(`Created activity with id: ${activity.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });