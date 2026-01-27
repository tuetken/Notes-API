import { Router } from "express";
import { getAllNotes, addNote } from "../data/notesStore.js";

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

export default router;
