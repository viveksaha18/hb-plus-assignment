import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool({
  connectionString: env.databaseUrl || undefined,
  ssl: env.databaseUrl ? { rejectUnauthorized: false } : false,
  max: 10,
});
