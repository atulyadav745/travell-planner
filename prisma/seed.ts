import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();

const activities = [
  {
    name: 'Eiffel Tower',
    description: 'Iconic wrought-iron lattice tower. Climb or take an elevator for panoramic city views.',
    city: 'Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    typicalDuration: 120, // 2 hours
  },
  {
    name: 'Louvre Museum',
    description: 'World\'s largest art museum and a historic monument. Home to the Mona Lisa.',
    city: 'Paris',
    latitude: 48.8606,
    longitude: 2.3376,
    typicalDuration: 240, // 4 hours
  },
  {
    name: 'Notre-Dame Cathedral',
    description: 'Medieval Catholic cathedral, widely considered one of the finest examples of French Gothic architecture.',
    city: 'Paris',
    latitude: 48.8530,
    longitude: 2.3499,
    typicalDuration: 60, // 1 hour
  },
  {
    name: 'Arc de Triomphe',
    description: 'Stands at the western end of the Champs-Élysées, honoring those who fought and died for France.',
    city: 'Paris',
    latitude: 48.8738,
    longitude: 2.2950,
    typicalDuration: 45, // 45 minutes
  },
  {
    name: 'Sacre-Coeur Basilica',
    description: 'A Roman Catholic church and minor basilica, dedicated to the Sacred Heart of Jesus.',
    city: 'Paris',
    latitude: 48.8867,
    longitude: 2.3431,
    typicalDuration: 60, // 1 hour
  },
  {
    name: 'Musée d\'Orsay',
    description: 'Housed in a former railway station, it holds mainly French art dating from 1848 to 1914.',
    city: 'Paris',
    latitude: 48.8600,
    longitude: 2.3265,
    typicalDuration: 150, // 2.5 hours
  },
  {
    name: 'Sainte-Chapelle',
    description: 'A royal chapel in the Gothic style, with one of the most extensive 13th-century stained glass collections anywhere in the world.',
    city: 'Paris',
    latitude: 48.8554,
    longitude: 2.3450,
    typicalDuration: 45, // 45 minutes
  },
  {
    name: 'Jardin du Luxembourg',
    description: 'Beautiful gardens created in 1612, featuring lawns, tree-lined promenades, flowerbeds, and the picturesque Medici Fountain.',
    city: 'Paris',
    latitude: 48.8462,
    longitude: 2.3372,
    typicalDuration: 90, // 1.5 hours
  },
  {
    name: 'Montmartre',
    description: 'A large hill in Paris\'s 18th arrondissement, known for its artistic history and the white-domed Sacré-Cœur Basilica.',
    city: 'Paris',
    latitude: 48.8867,
    longitude: 2.3431,
    typicalDuration: 180, // 3 hours
  },
  {
    name: 'Palace of Versailles',
    description: 'The principal royal residence of France from 1682, under Louis XIV, until the start of the French Revolution in 1789.',
    city: 'Paris', // Technically just outside, but considered a Paris activity
    latitude: 48.8049,
    longitude: 2.1204,
    typicalDuration: 300, // 5 hours
  },
  {
    name: 'Moulin Rouge',
    description: 'A world-famous cabaret in Paris, France, co-founded in 1889.',
    city: 'Paris',
    latitude: 48.8841,
    longitude: 2.3322,
    typicalDuration: 120, // 2 hours for a show
  },
  {
    name: 'Catacombs of Paris',
    description: 'Underground ossuaries which hold the remains of more than six million people in a small part of a tunnel network.',
    city: 'Paris',
    latitude: 48.8338,
    longitude: 2.3324,
    typicalDuration: 60, // 1 hour
  }
];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data to prevent duplicates
  await prisma.activity.deleteMany();
  console.log('Deleted existing activities.');

  for (const a of activities) {
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