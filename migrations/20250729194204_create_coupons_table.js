/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("coupons", (table) => {
        table.increments("id").primary();
        table.string("code").notNullable();
        table.date("expiration_date").nullable();
        table.decimal("discount_amount", 10, 2).nullable();
        table.boolean("is_active").defaultTo(true);
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("coupons");
};
