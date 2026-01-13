import pg from 'pg'
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg
const connectionString = process.env.POSTGRESURL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // This ignores the "self-signed" error
  }  
})

