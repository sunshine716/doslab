const fs = require('fs');
const path = require('path');
const routes = require('./routes');

routes.forEach(({ path: routePath, method }) => {
  const parts = routePath.split('/').filter(Boolean);

  // Correct file logic for '/', '/account', '/account/login'
  const file =
    parts.length === 0 ? 'index.js' :       // for '/'
    parts.length === 1 ? 'index.js' :       // for '/account'
    `${parts.pop()}.js`;                    // for '/account/login'

  const dir = path.join(__dirname, 'controllers', ...parts);
  fs.mkdirSync(dir, { recursive: true });

  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) {
    const relativePath = path.relative(__dirname, fullPath);
    const content = `module.exports = (req, res) => {
  res.send('${method.toUpperCase()} ${routePath} → ${relativePath}');
};
`;

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created ${fullPath}`);
  } else {
    console.log(`⚠️  Skipped existing file ${fullPath}`);
  }
});
