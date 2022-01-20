const express = require("express");
const path = require("path");
const fs = require("fs");
const res = require("express/lib/response");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.port || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (error, data) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.post("/api/notes", (req, res) => {
  const id = randomUUID();
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

app.delete();

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}.`);
});
