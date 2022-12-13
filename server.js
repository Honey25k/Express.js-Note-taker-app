const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const idForNote = require("uniqid");
const fs = require("fs");

const myApp = express(); 
const PORT = process.env.PORT || 3001; // reserve free PORT 3001

myApp.use(express.urlencoded({extended:true}));
myApp.use(express.json());

myApp.use(express.static("public"));

// "GET" route to index.html with
myApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });
// "GET" route to notes.html with
  myApp.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
// "GET" route for reading and returning notes from the db.json file 
myApp.get("/api/notes/", (req, res) => {
    res.json(db);
  });
// "POST route that saves new notes to request body,adds it to db.json and returns the new note to user"  
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
// "DELETE" route to delete old notes  
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