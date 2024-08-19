import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

import s from 'dotenv';
s.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: process.env.DATABASE_URL,
  ...knexSnakeCaseMappers(),
};

export default config;
