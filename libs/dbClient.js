//Loads environment variables from a .env file into process.env
require('dotenv').config();
// Import custom logger and PostgreSQL module
const logger = require('./logger');
const pg = require('pg');
const { types } = pg;

// Customize PostgreSQL type parsing:
// By default, PostgreSQL returns NUMERIC (OID 1700) values as strings.
// This parser converts them to JavaScript floats.
types.setTypeParser(1700, x => parseFloat(x));

// Map to store database connection pools, keyed by prefix (e.g., 'DB', 'DB_TEST')
const pools = {};

// Initialize a default pool using 'DB' environment variables (e.g., DB_HOST, DB_USER, etc.)
pools.db = createPool('DB');

/**
 * Reads database configuration from environment variables using a prefix.
 * For example, prefixName = 'DB' will read DB_HOST, DB_USER, etc.
 * 
 * @param {string} prefixName - The prefix for environment variables
 * @returns {object} - Database config object
 */
function getConfig(prefixName = 'DB') {
  const keys = ['HOST', 'USER', 'PORT', 'DATABASE', 'PASSWORD'];

  return Object.assign(
    {},
    ...keys.map(key => ({
      [key.toLowerCase()]: process.env[`${prefixName.toUpperCase()}_${key}`]
    }))
  );
}

/**
 * Creates a new PostgreSQL connection pool using config from env vars.
 * Also sets up an error handler to log pool-level errors.
 * 
 * @param {string} prefixName - The prefix for the env config (e.g., 'DB')
 * @returns {pg.Pool} - A configured PostgreSQL connection pool
 */
function createPool(prefixName) {
  const pool = new pg.Pool(getConfig(prefixName));
  // Log pool errors (e.g., idle client errors)
  pool.on('error', err => logger.error(`DB ${prefixName} pool error`, err));

  return pool;
}

/**
 * Creates a DB client interface tied to a specific connection pool.
 * Provides wrapper methods to execute queries using callbacks.
 * 
 * @param {string} prefixName - The prefix name used to identify the pool
 * @returns {object} - An object containing database operation functions
 */
function createDbClient(prefixName) {
  const pool = pools[prefixName];

  /**
   * Internal helper to run a SQL query using a pooled client.
   * Automatically releases the client after query execution.
   */
  function runQuery(sql, params, callback) {
    pool.connect((err, client, done) => {
      if (err) {
        logger.error(`The pool failed to connect to the database: ${err.message}`, err);
        return callback(err);
      }

      client.query(sql, params, (err, results) => {
        done(); // Release client back to the pool

        if (err) {
          logger.error(`Pool ${prefixName} failed to execute query`, { sql, params, err });
          return callback(err);
        }

        return callback(null, results);
      });
    });
  }

  return {
    /**
     * Executes a SQL query and returns all rows.
     * @param {string} sql - SQL statement
     * @param {Array} params - Query parameters
     * @param {function} callback - (err, rows) => {}
     */
    executeQuery(sql, params, callback) {
      runQuery(sql, params, (err, results) =>
        err ? callback(err) : callback(null, results.rows)
      );
    },

    /**
     * Executes a SQL query in async modeand returns all rows.
     * @param {string} sql - SQL statement
     * @param {Array} params - Query parameters
     * @param {function} callback - (err, rows) => {}
     */
    executeQueryAsync(sql, params) {
      return new Promise((resolve, reject) => {
        runQuery(sql, params, (err, results) =>
          err ? reject(err) : resolve(results.rows)
        );
      });
    },

    /**
     * Executes a SQL query and expects exactly one row.
     * Returns null if not exactly one row is returned.
     */
    getObject(sql, params, callback) {
      runQuery(sql, params, (err, results) => {
        if (err) { return callback(err); }
        if (results.rows.length !== 1) { return callback(null, null); };
        return callback(null, results.rows[0]);
      });
    },

    getObjectAsync(sql, params) {
      return new Promise((resolve, reject) => {
        runQuery(sql, params, (err, results) => {
          if (err) { return reject(err); }
          if (results.rows.length !== 1) { return resolve(null); }
          return resolve(results.rows[0]);
        });
      });
    },
    
    /**
     * Executes a SQL query and returns the number of affected rows.
     */
    getCount(sql, params, callback) {
      runQuery(sql, params, (err, results) =>
        err ? callback(err) : callback(null, results.rowCount)
      );
    },

    getCountAsync(sql, params) {
      return new Promise((resolve, reject) => {
        runQuery(sql, params, (err, results) => {
          if (err) { return reject(err); }
          return resolve(results.rowCount);
        });
      });
    },

        /**
     * Inserts a new record into a table.
     * @param {string} table - Table name
     * @param {object} data - Key-value pairs representing columns and values
     * @param {function} callback - (err, insertedRow) => {}
     */
    insert(table, data, callback) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, idx) => `$${idx + 1}`);

      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;

      runQuery(sql, values, (err, results) =>
        err ? callback(err) : callback(null, results.rows[0])
      );
    },

    insertAsync(table, data) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, idx) => `$${idx + 1}`);

      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;

      return this.executeQueryAsync(sql, values).then(rows => rows[0]);
    },

    /**
     * Updates a record in a table with WHERE clause.
     * @param {string} table - Table name
     * @param {object} data - Key-value pairs to update
     * @param {object} where - Key-value pairs for the WHERE clause
     * @param {function} callback - (err, updatedRowCount) => {}
     */
    update(table, data, where, callback) {
      const setKeys = Object.keys(data);
      const whereKeys = Object.keys(where);

      const setClause = setKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const whereClause = whereKeys.map((key, i) => `${key} = $${setKeys.length + i + 1}`).join(' AND ');
      const values = [...Object.values(data), ...Object.values(where)];

      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

      runQuery(sql, values, (err, results) =>
        err ? callback(err) : callback(null, results.rowCount)
      );
    },

    updateAsync(table, data, where) {
      const setKeys = Object.keys(data);
      const whereKeys = Object.keys(where);

      const setClause = setKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const whereClause = whereKeys.map((key, i) => `${key} = $${setKeys.length + i + 1}`).join(' AND ');
      const values = [...Object.values(data), ...Object.values(where)];

      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

      return this.getCountAsync(sql, values);
    }

  };
}

/**
 * Module entry point: provides a db client for the given prefix.
 * The given prefixName is configured from .env file and it is 
 * used to identify the connection pool.
 * 
 * Creates a connection pool on first use and reuses it afterward.
 * 
 * @param {string} prefixName - The prefix for DB environment variables (default: 'DB')
 * @returns {object} - Object with database helper functions
 */
module.exports = function (prefixName = 'DB') {
  const key = prefixName.toUpperCase();

  if (!pools[key]) {
    pools[key] = createPool(prefixName);
  }

  return createDbClient(key);
};

/**
 * Gracefully closes all active PostgreSQL connection pools.
 * 
 * This should be called when the application is shutting down (e.g., in test cleanup,
 * SIGINT handler, or graceful termination hooks) to release all idle and active
 * database connections and prevent open handle warnings or memory leaks.
 */
module.exports.close = () => {
  for (const key in pools) {
    pools[key].end(); // close all open pool connections
  }
};
