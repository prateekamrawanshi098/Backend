// server create krna

const express = require("express")

const app = express()

app.use(express.json())

const notes = [];

app.get("/", (req,res)=> {
    res.send("Hello world")
})

app.post("/notes", (req,res) => {
    console.log(req.body);
    notes.push(req.body)
    res.send("note created");
})

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.delete('/notes/:index', (req, res) => {
    console.log(req.params.index);
    delete notes[req.params.index]
})

app.patch('/notes/:index', (req, res) => {
    notes[req.params.index]=req.body
})

module.exports=app