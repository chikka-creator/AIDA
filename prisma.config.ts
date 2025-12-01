import 'dotenv/config'; // Loads environment variables from .env file
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma', // Path to your schema file
  migrations: {
    path: './prisma/migrations', // Path where migration files will be stored
  },
  datasource: {
    // Uses the DATABASE_URL environment variable for direct connection
    url: env('DIRECT_URL'),
  },
});
