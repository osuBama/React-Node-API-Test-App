require('dotenv').config();
require('mssql');


//This is the central DB pool module, to be reused for all SQL handling

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

let poolPromise;

function getPool(){
 if(!poolPromise){
    poolPromise = sql.connect(config)
        .then(p =>{
            return p.request().query('SELECT 1 AS ok').then(() => p);
        })    
        .catch(err => {
            poolPromise = undefined;
            throw err;
        });
    }
    return poolPromise;
}

async function query(q, params = []) {
  const pool = await getPool();
  const req = pool.request();
  for (const { name, type, value } of params) {
    req.input(name, type, value);
  }
  return req.query(q);
}

module.exports = { getPool, query, config };