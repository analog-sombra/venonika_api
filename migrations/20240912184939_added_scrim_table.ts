import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('scrim', function table(table) {
      table.string('id').primary();
      table.string('guild_id').notNullable();
      table.string('name').notNullable();
      table.string('registration_channel').notNullable();
      table.string('allowed_role').nullable(); // commma separated
      table.string('registered_role').nullable(); // commma separated
      table.integer('slot').notNullable();
      table.integer('team_member').notNullable().defaultTo(1);
      table.timestamp('registration_start_dateTime').notNullable();
      table.timestamp('registration_end_dateTime').notNullable();
      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    })
    .createTable('guild', function (table) {
      table.string('id').primary();
      table.string('scrim_log_channel').nullable();

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('scrim');
  await knex.schema.dropTable('guild');
}
