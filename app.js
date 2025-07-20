require('dotenv').config(); // Load .env

const express = require('express');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const app = express();

const routes = require('./routes');
const authMiddleware = require('./middleware/auth');
const errorMiddlware = require('./middleware/error');
const notFoundMiddleware = require('./middleware/404');
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

const PORT = process.env.PORT || 3000;

app.locals.appName = pkg.name;
app.locals.pltName = process.env.PLT_NAME || 'MyApp'; // Use environment variable or default

const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',          // Use an environment variable in production!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }           // Set to true if using HTTPS
}));

app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // for JSON payloads
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');
// Server static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Loop through each route configuration from routes.js
routes.forEach(({ method, path: routePath, authRequired }) => {
  const httpMethod = method.toLowerCase();
  // Resolve the absolute path to the corresponding controller file
  const controllerPath = getControllerPath(routePath);
  // If the controller file does not exist, log a warning and skip registration
  if (!fs.existsSync(controllerPath)) {
    logger.warn(`⚠️  Controller not found for route ${routePath} → ${controllerPath}`);
    return;
  }
  
  const handlerModule = require(controllerPath);
  // Select the handler function for the current HTTP method (e.g., handlerModule.get)
  const handler = handlerModule[httpMethod];
  // If the handler is not a function, log a warning and skip registration
  if (typeof handler !== 'function') {
    logger.warn(`⚠️  No ${httpMethod.toUpperCase()} handler in ${controllerPath}`);
    return;
  }
  // If auth is required, include the auth middleware before the handler
  const middlewares = authRequired ? [authMiddleware, handler] : [handler];
  // Register the route with Express using the appropriate HTTP method
  app[httpMethod](routePath, ...middlewares);
  // Log successful registration
  logger.debug(`✅ Registered ${method.toUpperCase()} ${routePath} → ${controllerPath.substring(__dirname.length + 1)}#${httpMethod}`);
});

//404 Not Found Middleware
app.use(notFoundMiddleware);
//global error handling middleware
app.use(errorMiddlware);

// Only start the server if not in test environment. 
// This allows Jest tests to run without starting the server.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export the app for testing

