/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("profiles", (table) => {
        table.increments("id").primary();
        table.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
        table.string("family_name").notNullable();
        table.string("given_name").notNullable();
        table.string("phone_number").nullable();
        table.string("country").nullable();
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("profiles");
};
