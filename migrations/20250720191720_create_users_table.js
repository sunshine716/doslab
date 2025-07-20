exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').unique();
    table.string('password').notNullable();
    table.string('role').defaultTo('user'); // e.g., 'admin', 'user'
    table.boolean('is_active').defaultTo(true); // Soft delete flag
    table.string('salt'); // For password hashing
    table.string('reset_token'); // For password reset functionality
    table.timestamp('reset_token_expiry'); // Expiry for reset token
    table.string('verification_token'); // For email verification
    table.timestamp('verification_token_expiry'); // Expiry for verification token
    table.string('profile_picture'); // URL to profile picture
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Last update timestamp

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
