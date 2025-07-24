const fs = require('fs');
const path = require('path');

// Import route definitions
const routes = require('../routes/basic');

// Iterate over each route to generate corresponding controller and model files
routes.forEach(({ path: routePath, _method }) => {
  const parts = routePath.split('/').filter(Boolean);

  // Determine controller file name
  const controllerFile =
    parts.length === 0 ? 'index.js' :
    parts.length === 1 ? 'index.js' :
    `${parts.pop()}.js`;

  // Construct directory for controller
  const controllerDir = path.join(__dirname, '..', 'controllers', ...parts);
  fs.mkdirSync(controllerDir, { recursive: true });
  const controllerPath = path.join(controllerDir, controllerFile);

  // Generate controller file
  if (!fs.existsSync(controllerPath)) {
    const controllerContent = `const get = (req, res) => {
  res.send('GET: TODO - Implement ${routePath} GET handler');
};

const post = (req, res) => {
  res.send('POST: TODO - Implement ${routePath} POST handler');
};

module.exports = {
  get,
  post
};`;
    fs.writeFileSync(controllerPath, controllerContent);
    console.log(`✅ Created controller: ${path.relative(process.cwd(), controllerPath)}`);
  } else {
    console.log(`⚠️  Skipped existing controller: ${path.relative(process.cwd(), controllerPath)}`);
  }

  // Generate model file for the first-level route segment (e.g., 'account')
  const modelName = parts.length > 0 ? parts[0] : 'index';
  const modelDir = path.join(__dirname, '..', 'models');
  const modelPath = path.join(modelDir, `${modelName}.js`);

  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir);
  }

  if (!fs.existsSync(modelPath)) {
    const modelContent = `// TODO: Define model for ${modelName}
module.exports = {
  // Example: findById(id) { ... }
};`;
    fs.writeFileSync(modelPath, modelContent);
    console.log(`✅ Created model: ${path.relative(process.cwd(), modelPath)}`);
  } else {
    console.log(`⚠️  Skipped existing model: ${path.relative(process.cwd(), modelPath)}`);
  }
});
