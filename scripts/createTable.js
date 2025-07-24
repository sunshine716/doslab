const { el } = require('@faker-js/faker');
const { execSync } = require('child_process');
let name = process.env.npm_config_name;

if (!name) {
  console.error('Please provide a name, e.g. npm run create-table --name=orders');
  process.exit(1);
}

if (name === "true") {
  name = process.argv[2];
}

console.log(`Creating table and seed files for: ${name}`);
execSync(`npx knex migrate:make create_${name}_table`, { stdio: 'inherit' });
execSync(`npx knex seed:make seed_${name}`, { stdio: 'inherit' });
