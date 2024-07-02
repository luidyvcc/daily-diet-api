import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable().unique()
        table.string('avatarURL')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user')
}

