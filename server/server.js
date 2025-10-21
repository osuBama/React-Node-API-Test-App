//Setting up environment variables with dotEnv
require('dotenv').config();

//Lets set up an API for the frontend to talk to the backend
const express = require('express');
const { getPool } = require('./sqlserver');
const app = express();

app.use(express.json());



app.listen(process.env.NODE_SERVER_PORT, () => {console.log("Listening on port " + process.env.NODE_SERVER_PORT)} )


//Check if server is alive
app.get("/api/alive", async (_, res) =>{
   try {
    await getPool();
    res.json({ok: true});
    console.log("Ai puta, tou viva, deixa-me")
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


