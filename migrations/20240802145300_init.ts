import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user', function table(table) {
      table.uuid('id').primary();
      table.string('user_id').notNullable().unique();
      table.string('username').notNullable();
      table.string('global_name');
      table.string('avatar');
      table.boolean('mfa_enabled');
      table.boolean('verified');
      table.string('email');
      table.string('access_token');
      table
        .enum('role', ['SYSTEM_ADMIN', 'MODERATOR', 'USER'])
        .defaultTo('USER');

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    })
    .createTable('session', function table(table) {
      table.string('id').primary().notNullable();
      table
        .string('user_id')
        .notNullable()
        .references('user_id')
        .inTable('user');
      table.dateTime('expires_at').notNullable();

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    })
    .createTable('event', (table) => {
      table.string('id').primary().notNullable();
      table.string('event_id').unique();
      table.string('guild_id');
      table.string('channel_id');
      table.string('name');
      table.string('description');
      table.string('creator_id');
      table.string('image_url');
      table.string('tags');
      table.string('category');
      table.dateTime('scheduled_start_time').notNullable;
      table
        .enum('status', ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELED'])
        .notNullable();
      table
        .enum('entity_type', ['STAGE_INSTANCE', 'VOICE', 'EXTERNAL'])
        .notNullable();

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    })
    .createTable('featured_event', (table) => {
      table.string('id').primary().notNullable();
      table.string('event_id').references('id').inTable('event');

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .string('created_by')
        .references('user_id')
        .inTable('user')
        .onDelete('CASCADE');
    })
    .createTable('category', (table) => {
      table.string('id').primary().notNullable();
      table.string('name');
      table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
      table.string('type');

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table.string('created_by').references('user_id').inTable('user');

      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
      table.string('updated_by').references('user_id').inTable('user');

      table.timestamp('deleted_at').defaultTo(null);
      table.string('deleted_by').references('user_id').inTable('user');
    })
    .createTable('event_comment', (table) => {
      table.string('id').primary().notNullable();
      table.string('user_id').references('user_id').inTable('user');
      table.string('target_id').references('event_id').inTable('event');
      table.text('comment');

      table
        .timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable();
    })
    .createTable('event_like', (table) => {
      table.string('id').primary().notNullable();
      table.string('user_id').references('user_id').inTable('user');
      table.string('target_id').references('event_id').inTable('event');

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
  await knex.schema
    .dropTable('featured_event')
    .dropTable('session')
    .dropTable('event_comment')
    .dropTable('event_like')
    .dropTable('category')
    .dropTable('event')
    .dropTable('user');
}
