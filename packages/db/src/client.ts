import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '../../.env' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the connection
const sql = neon(process.env.DATABASE_URL!);

// Create and export the database client
export const db = drizzle(sql as any, { schema });

export type Database = typeof db;
