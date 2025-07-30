const { faker } = require('@faker-js/faker');
// seeds/seed_profiles.js

exports.seed = async function(knex) {

  // Deletes ALL existing entries
  return knex('coupons').del()
    .then(function () {
      // Inserts seed entries
      return knex('coupons').insert([
        {
          code: 'SAVEAAA2025',
          expiration_date: faker.date.future(),
          discount_amount: faker.number.int({ min: 10000, max: 99999 }),
          is_active: true
        },
        {
          code: 'SAVEABA2025',
          expiration_date: faker.date.future(),
          discount_amount: faker.number.int({ min: 10000, max: 99999 }),
          is_active: true
        },
        {
          code: 'SAVEBBB2025',
          expiration_date: faker.date.future(),
          discount_amount: faker.number.int({ min: 10000, max: 99999 }),
          is_active: false
        },
        {
          code: 'SAVEABB2025',
          expiration_date: faker.date.future(),
          discount_amount: faker.number.int({ min: 10000, max: 99999 }),
          is_active: false
        }
      ]);
    });
};

          