/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("quotes", (table) => {
        table.increments("id").primary();
        table.string("ipn_or_cpn").notNullable();
        table.string("part_name").notNullable();
        table.text("manufacturer").nullable();
        table.float("unit_price").notNullable();
        table.integer("qty").nullable();
        table.float("line_total").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("quotes");
};
