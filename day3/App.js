const express = require("express");

const App = express();
App.use(express.json())

const notes=[]

App.get("/", (req, res) => {
  res.send("Home Page");
});

App.get("/about", (req, res) => {
  res.send("About Page");
});


App.post("/notes", (req, res) => {
    console.log(req.body);

    notes.push(req.body)
    
    res.send("Data Posted")
})


App.get("/notes", (req,res) => {
    res.send(notes )
})

App.listen(3000, () => {
    console.log("Server started on port 3000");
    
});
