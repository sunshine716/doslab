require('dotenv').config(); // Load .env
const express = require('express');
const pkg = require('./package.json');
const app = express();
const path = require('path');
const routes = require('./routes/basic'); // Import route definitions
const errorMiddlware = require('./middleware/error');
const notFoundMiddleware = require('./middleware/404');
const localsMiddleware = require('./middleware/locals');
const loggingMiddlware = require('./middleware/logging');
const logger = require('./libs/logger');
const routesRegister = require('./utils/routesRegister');
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

// Server static files (CSS, JS, images) middlware
app.use(express.static(path.join(__dirname, 'public')));
//logging middlware
app.use(loggingMiddlware);
//localsMiddlware, it is used to expose req object for all view template
app.use(localsMiddleware);
// Register routes
routesRegister(app, routes);
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

