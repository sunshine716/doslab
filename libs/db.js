// dbClient.js
const { Pool } = require('pg');
const logger = require('./log'); // ensure you have a logger module

// Singleton pool instance
const pool = createPool();

function createPool() {
    const config = {
        host: process.env.DB_CSS_HOST,
        port: process.env.DB_CSS_PORT,
        user: process.env.DB_CSS_USER,
        password: process.env.DB_CSS_PASSWORD,
        database: process.env.DB_CSS_DB,
        max: 10,
    };

    const pool = new Pool(config);
    pool.on('error', err => {
        logger.error('Unexpected error on idle client', err);
    });

    return pool;
}

function doExecuteQuery(sql, params) {
    return pool.query(sql, params);
}

function executeQuery(sql, params, callback) {
    doExecuteQuery(sql, params)
        .then(results => callback(null, results.rows))
        .catch(err => callback(err));
}

function getObject(sql, params, callback) {
    doExecuteQuery(sql, params)
        .then(results => {
            const first = results.rows.length > 0 ? results.rows[0] : null;
            callback(null, first);
        })
        .catch(err => callback(err));
}

module.exports = {
    executeQuery,
    getObject,
    // Optional: support promise-based usage
    executeQueryAsync: (sql, params) => doExecuteQuery(sql, params).then(res => res.rows),
    getObjectAsync: async (sql, params) => {
        const res = await doExecuteQuery(sql, params);
        return res.rows.length > 0 ? res.rows[0] : null;
    }
};
