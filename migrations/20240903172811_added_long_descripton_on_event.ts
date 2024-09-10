import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('event', (table) => {
    table.specificType('long_description', 'MEDIUMTEXT');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('event', (table) => {
    table.dropColumn('long_description');
  });
}
