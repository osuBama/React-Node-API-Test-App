//Lets set up an API for the frontend to talk to the backend
const express = require('express')
const app = express()

//CRUDs go here
app.get("/api", (req, res) =>{
    res.json()
})

