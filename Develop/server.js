const fs = require('fs');
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

const { notes } = require("./db/db.json");

// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
const generateUniqueId = require('generate-unique-id');

// express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
  };  

// GET * should return the index.html file.
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
res.json(notes);
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post('/api/notes', (req, res) => {
req.body.id = generateUniqueId();
const note = createNewNote(req.body, notes);
res.json(note);
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });