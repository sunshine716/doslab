const express = require('express');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const app = express();

const routes = require('./routes');
const authMiddleware = require('./middleware/auth');
const logger = require('./libs/logger');

// Convert route path like "/account/profile" to "./controllers/account/profile.js"

function getControllerPath(routePath) {
  const parts = routePath.split('/').filter(Boolean); // e.g., '/account/login' → ['account', 'login']
  const file = parts.length === 0
    ? 'index.js'                          // for '/'
    : parts.length === 1
    ? 'index.js'                         // for '/account'
    : `${parts.pop()}.js`;               // for '/account/login' → 'login.js'

  const dir = path.join(__dirname, 'controllers', ...parts);
  return path.join(dir, file);
}

app.locals.appName = pkg.name;
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',          // Use an environment variable in production!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }           // Set to true if using HTTPS
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');
// Server static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));




routes.forEach(({ method, path: routePath, authRequired }) => {
  const httpMethod = method.toLowerCase();
  const controllerPath = getControllerPath(routePath);

  if (!fs.existsSync(controllerPath)) {
    logger.warn(`⚠️  Controller not found for route ${routePath} → ${controllerPath}`);
    return;
  }

  const handlerModule = require(controllerPath);
  const handler = handlerModule.default || handlerModule;

  if (typeof handler !== 'function') {
    logger.warn(`⚠️  Invalid handler in ${controllerPath}`);
    return;
  }

  const middlewares = authRequired ? [authMiddleware, handler] : [handler];
  app[httpMethod](routePath, ...middlewares, handler);
  logger.debug(`✅ Registered ${method.toUpperCase()} ${routePath} → ${controllerPath}`);
});

app.listen(3000, () => {
  logger.info('🚀 Server is running on http://localhost:3000');
});
