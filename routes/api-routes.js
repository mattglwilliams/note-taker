const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const res = require("express/lib/response");
const { randomUUID } = require("crypto");
const id = randomUUID();

router.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "../db/db.json"), "utf-8", (error, data) => {
      if (error) {
        res.status(404).send(error);
      } else {
        res.send(JSON.parse(data));
      }
    });
  });
  
router.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = { title, text, id };

        fs.readFile("./db/db.json", "utf8", (error, data) => {
        if (error) {
            console.log(error);
        } else {
            const parsedNote = JSON.parse(data);
            parsedNote.push(newNote);
            fs.writeFile("./db/db.json", JSON.stringify(parsedNote), (error) => {
            error ? console.log(error) : res.send("Success");
            });
        }
        });
    }
});
  
router.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", (error, data) => {
        if (error) {
        res.send(error);
        } else {
        const notes = JSON.parse(data);
        const newNotesArr = notes.filter((note) => note.id !== req.params.id);
        fs.writeFile("./db/db.json", JSON.stringify(newNotesArr), (error) => {
            error ? console.log(error) : res.send("Success");
        });
        console.log(req.params.id);
        }
    });
});

module.exports = router;