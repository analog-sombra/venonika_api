import { Knex } from 'knex';

// Environment variable
import dotenv from 'dotenv';
dotenv.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: process.env.DATABASE_URL,
};

export default config;
