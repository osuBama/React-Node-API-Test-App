//Setting up environment variables with dotEnv
require('dotenv').config();

//Lets set up an API for the frontend to talk to the backend
const express = require('express');
const app = express();

var serverPort = 5000

app.listen(serverPort, () => {console.log("Listening on port " + serverPort)} )


//Check if server is alive
app.get("/alive", (req, res) =>{
    res.json({ok: true, environment: process.env.NODE_ENV })
})

//CRUDs go here
app.get("/api", (req, res) =>{
    res.json()
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


