const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in quotes
  await knex('quotes').del();

  // Fetch all user IDs from the users table
  const users = await knex('users').select('id');
  if (users.length === 0) {
    throw new Error('No users found in the users table!');
  }
  // Get array of user ids
  const userIds = users.map(u => u.id);

  const records = [];

  for (let i = 1; i <= 1200; i++) {
    const prefix = faker.helpers.arrayElement(['IPN', 'CPN']);
    const partCode = `${prefix}-${faker.number.int({ min: 10000, max: 99999 })}`;
    const qty = faker.number.int({ min: 1, max: 1000 });
    const unit_price = parseFloat(faker.number.float({ min: 1, max: 500, precision: 0.01 }).toFixed(2));
    const line_total = parseFloat((unit_price * qty).toFixed(2));
    // Randomly select a user_id
    const user_id = faker.helpers.arrayElement(userIds);

    records.push({
      ipn_or_cpn: partCode,
      part_name: faker.commerce.productName(),
      manufacturer: faker.company.name(),
      unit_price,
      qty,
      line_total,
      user_id, // new field, must match your table schema
    });
  }

  await knex('quotes').insert(records);
};
