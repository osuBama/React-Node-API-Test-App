require('dotenv').config();

const sql = require('mssql');

const config = {
server: process.env.SQL_SERVER,
port: Number(process.env.SQL_PORT || 1433),
database: process.env.SQL_DB,
user: process.env.SQL_USER,
password: process.env.SQL_PASSWORD,
options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_CERT === 'true'
  },
  pool: {
    min: Number(process.env.SQL_POOL_MIN || 1),
    max: Number(process.env.SQL_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.SQL_POOL_IDLE || 30000)
  }
};



const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => console.error('[DB] pool error:', err));
pool.on('connect', () => console.log('[DB] pool connected'));
pool.on('acquire', () => console.log('[DB] connection acquired'));
pool.on('release', () => console.log('[DB] connection released'));

async function query(q, params = []) {
  await poolConnect; // wait until the single pool is ready
  const req = pool.request();
  for (const { name, type, value } of params) req.input(name, type, value);
  return req.query(q);
}

module.exports = { pool, sql, query };
