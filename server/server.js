//Setting up environment variables with dotEnv
require('dotenv').config();

//Lets set up an API for the frontend to talk to the backend



require('dotenv').config();
const express = require('express');
const app = express();
const sql = require('mssql');

app.use(express.json());
app.listen(process.env.NODE_SERVER_PORT, () => {console.log("Listening on port " + process.env.NODE_SERVER_PORT)} )

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




//Check if server is alive
app.get("/api/alive", async (req, res) =>{
   try {
    await poolConnect();
    res.json({ok: true});
   } catch(e) {
    res.status(500).json({ok: false, error: 'Could not connect to the server'});
   }
});

//CRUDs go here

app.get("/api/users/:id", async (req, res) =>{ //get user by ID
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'INVALID_ID' }); //basic sanity check

    try{
        const result = await query(
            'SELECT uniqueID, userName, job, DOB FROM dbo.Users WHERE uniqueID = @id',
            [{ name: 'id', type: sql.Int, value: id }]
        );
        if(result.recordset.length === 0) return res.status(404).json({ error: 'NOT_FOUND'});
        res.json(result.recordset[0]);
    } catch(e) {
        res.status(404).json({ok: false, error: 'USER_NOT_FOUND'});
    }
})

app.post("/api", (req, res) =>{
    res.json()
})

app.put("/api", (req, res) =>{
    res.json()
})

app.delete("/api", (req, res) =>{
    res.json()
})


