const { faker } = require('@faker-js/faker');
// seeds/seed_profiles.js

exports.seed = async function(knex) {

  // Fetch all user IDs from the users table
  const users = await knex('users').select('id');
  if (users.length === 0) {
    throw new Error('No users found in the users table!');
  }
  // Get array of user ids
  const userIds = users.map(u => u.id);

  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert([
        {
          user_id: faker.helpers.arrayElement(userIds),
          family_name: 'Smith',
          given_name: 'Alice',
          phone_number: '123-456-7890',
          country: 'USA'
        },
        {
          user_id: faker.helpers.arrayElement(userIds),
          family_name: 'Johnson',
          given_name: 'Bob',
          phone_number: '987-654-3210',
          country: 'USA'
        },
        {
          user_id: faker.helpers.arrayElement(userIds),
          family_name: 'Williams',
          given_name: 'Charlie',
          phone_number: '555-555-5555',
          country: 'USA'
        }
      ]);
    });
};

          