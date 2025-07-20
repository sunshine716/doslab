const fs = require('fs');
const path = require('path');

// Import route definitions
const routes = require('../routes');

// Iterate over each route to generate corresponding controller files
routes.forEach(({ path: routePath, _method }) => {
  // Split the route path into segments (e.g., '/account/login' → ['account', 'login'])
  const parts = routePath.split('/').filter(Boolean);

  // Determine the file name:
  // - '/'           → index.js
  // - '/account'    → index.js
  // - '/account/login' → login.js
  const file =
    parts.length === 0 ? 'index.js' :
    parts.length === 1 ? 'index.js' :
    `${parts.pop()}.js`;

  // Construct the directory path under the top-level /controllers/ directory
  const dir = path.join(__dirname, '..', 'controllers', ...parts);

  // Recursively create the directory if it doesn't exist
  fs.mkdirSync(dir, { recursive: true });

  // Full path to the controller file
  const fullPath = path.join(dir, file);

  // If the file doesn't already exist, create it with default GET and POST handlers
  if (!fs.existsSync(fullPath)) {
    const content = `const get = (req, res) => {
  res.send('GET: TODO - Implement ${routePath} GET handler');
};

const post = (req, res) => {
  res.send('POST: TODO - Implement ${routePath} POST handler');
};

module.exports = {
  get,
  post
};`;

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created ${path.relative(process.cwd(), fullPath)}`);
  } else {
    // If the file already exists, skip generation to avoid overwriting
    console.log(`⚠️  Skipped existing file ${path.relative(process.cwd(), fullPath)}`);
  }
});
