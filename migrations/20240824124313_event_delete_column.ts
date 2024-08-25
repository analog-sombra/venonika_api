import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw('ALTER TABLE event MODIFY description VARCHAR(1000)');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw('ALTER TABLE event MODIFY description VARCHAR(255)');
}
