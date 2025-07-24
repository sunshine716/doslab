// seeds/seed_users.js

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'alice',
          email: 'alice@example.com',
          password: 'd45c34cf8f07df774b644a81c9932328a497df79bd786ab1226710fce3f7a59ec012b994cbf989ece5a9e57bbcc62230c0e9947fe9f83376a61510d04f532794',
          role: 'admin',
          is_active: true,
          salt: 'random_salt_1',
          reset_token: null,
          reset_token_expiry: null,
          verification_token: 'verify_token_1',
          verification_token_expiry: knex.fn.now(),
          profile_picture: 'https://example.com/alice.png',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        },
        {
          username: 'bob',
          email: 'bob@example.com',
          password: 'hashed_password_2',
          role: 'user',
          is_active: true,
          salt: 'random_salt_2',
          reset_token: null,
          reset_token_expiry: null,
          verification_token: 'verify_token_2',
          verification_token_expiry: knex.fn.now(),
          profile_picture: 'https://example.com/bob.png',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        },
        {
          username: 'charlie',
          email: 'charlie@example.com',
          password: 'hashed_password_3',
          role: 'user',
          is_active: false,
          salt: 'random_salt_3',
          reset_token: 'reset_token_3',
          reset_token_expiry: knex.fn.now(),
          verification_token: null,
          verification_token_expiry: null,
          profile_picture: null,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        }
      ]);
    });
};
