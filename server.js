const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const idForNote = require("uniqid");
const fs = require("fs");

const myApp = express();
const PORT = process.env.PORT || 3001;

myApp.use(express.urlencoded({extended:true}));
myApp.use(express.json());

myApp.use(express.static("public"));

myApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  myApp.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

myApp.get("/api/notes/", (req, res) => {
    res.json(db);
  });

  myApp.post("/api/notes", (req, res) => {
    console.log(`${req.method} request received`);
    const { title, text } = req.body;
  
    if (text && title) {
      let newUserNote = {
        title,
        text,
        id: idForNote(),
      };
      db.push(newUserNote);
      fs.writeFileSync("./db/db.json", JSON.stringify(db, null, 4));
  
      const response = {
        status: "success",
        body: newUserNote,
      };
      res.json(response);
    }
  });

  myApp.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    const oldNote = db.findIndex((note) => note.id === id);
    console.log(oldNote);
    let removeNote = db.splice(oldNote, 1);
    fs.writeFileSync("./db/db.json", JSON.stringify(removeNote, null, 4));
    return res.send(removeNote);
  }); 

  myApp.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });  