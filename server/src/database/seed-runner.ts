import { config } from 'dotenv';
config();

import { DataSource } from 'typeorm';
import { seedDatabase } from './seed';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    await seedDatabase(AppDataSource);

    await AppDataSource.destroy();
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
