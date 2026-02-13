const express = require("express")

const App = express();

App.get('/', (req,res) => {
    res.send("Home Page")
})

App.get("/About", (req, res) => {
  res.send("About Page");
});

App.listen(3000)