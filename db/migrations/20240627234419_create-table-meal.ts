import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('meal', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').after('id').index().notNullable().references('id').inTable('user').onDelete('CASCADE')
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.timestamp('date').notNullable()
        table.boolean('is_diet').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('meal')
}

