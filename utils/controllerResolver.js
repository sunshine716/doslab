const path = require('path');

/**
 * Converts a route path (e.g., "/account/profile") into a file path
 * like "controllers/account/profile.js"
 */
function getControllerPath(routePath) {
  const parts = routePath.split('/').filter(Boolean); // remove leading/trailing slashes
  const file = parts.length === 0
    ? 'index.js'
    : parts.length === 1
    ? 'index.js'
    : `${parts.pop()}.js`;

  const dir = path.join(__dirname, '../controllers', ...parts);
  return path.join(dir, file);
}

module.exports = {
  getControllerPath
};
