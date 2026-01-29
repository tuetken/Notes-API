import { Router } from "express";
import { getAllNotes, addNote } from "../data/notesStore.js";
import { randomUUID } from "crypto";

const router = Router();

// GET /api/notes
router.get("/", (req, res) => {
  const notes = getAllNotes();
  res.status(200).json({ notes });
});

// GET /api/notes/:id
router.get("/:id", (req, res) => {
  // extract id from request
  const { id } = req.params;

  // copy database and assign to variable
  const notes = getAllNotes();

  // placeholder variable if note is found
  let foundNote = null;

  // loop through store
  for (const note of notes) {
    if (note.id === id) {
      foundNote = note;
      break;
    }
  }

  if (!foundNote) {
    return res.status(400).json({ error: "ID not found" });
  }

  res.status(200).json({ noteByID });
});

// POST /api/notes
router.post("/", (req, res) => {
  const { title, content } = req.body;

  // checks for missing title / content
  if (!title || !content) {
    return res.status(400).json({ error: "Requires title and content" });
  }

  // creates new note object
  const newNote = {
    id: randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  // appends to addNote which stores in notes[] "database" (./data/notesStore)
  addNote(newNote);
  res.status(201).json(newNote);
});

// PUT /api/notes/:id
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const notes = getAllNotes();
  const { title, content } = req.body;

  // checks for modifications
  if (!title && !content) {
    res.status(400).json({ error: "At least one field must be modified" });
  }

  let foundNote = null;

  // checks for id in notes[]
  for (const note of notes) {
    if (note.id === id) {
      foundNote = note;
      break;
    }
  }

  // if id doesnt exist
  if (!foundNote) {
    return res.status(404).json({ error: "ID not found" });
  }

  // if id does exist: modify and return
  if (title) {
    foundNote.title = title;
  }

  if (content) {
    foundNote.content = content;
  }

  res.status(200).json(foundNote);
});

// DELETE api/notes/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const notes = getAllNotes();

  let foundIndex = -1;

  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === id) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    return res.status(404).json({ error: "ID not found" });
  }

  notes.splice(foundIndex, 1);

  return res.status(200).json({ message: "Note successfully deleted" });
});

export default router;
