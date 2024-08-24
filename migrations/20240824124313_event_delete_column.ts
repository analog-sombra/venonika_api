import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('event', (table) => {
    table.timestamp('deleted_at').defaultTo(null);
    table.string('deleted_by').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('event', (table) => {
    table.dropColumn('deleted_at').dropColumn('deleted_by');
  });
}
