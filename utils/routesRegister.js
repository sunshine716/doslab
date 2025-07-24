
const { getControllerPath } = require('./controllerResolver');
const authMiddleware = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const logger = require('../libs/logger');

// Loop through each route configuration from routes/basic.js
const routesRegister = (app, routes) => {

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
        const relPath = path.relative(__dirname, controllerPath).replace(/^(\.\.[/\\])+/, '');
        logger.debug(`✅ Registered ${method.toUpperCase()} ${routePath} → ${relPath}#${httpMethod}`);
    });
};

module.exports = routesRegister;