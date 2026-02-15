const express = require("express");

const app = express();

app.use(express.json());

const notes = [];

app.post("/notes", (req, res) => {
  notes.push(req.body);

  res.status(201).json({
    message: "Note created successfully",
  });
});
app.get("/notes", (req, res) => {
  res.status(200).json({
    notes: notes,
  });
});

app.delete("/notes/:id", (req, res) => {
  delete notes[req.params.id];
  res.status(200).json({
    message: "Note deleted successfully",
  });
});

app.patch("/notes/:id", (req, res) => {
    notes[req.params.id].description = req.body.description
    res.status(200).json(
        {
            message: "Note updated successfully"
            }
        );

})

module.exports = app;
