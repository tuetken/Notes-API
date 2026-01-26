import { Router } from "express";
import { getAllNotes, addNote } from "./data/notesStore";

const router = Router();

// GET /api/notes
router.get("/", (req, res) => {
  const notes = getAllNotes;
  res.status(200).json({ notes });
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
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString,
  };

  // appends to addNote which stores in notes[] "database" (./data/notesStore)
  addNote(newNote);
  res.status(201).json(newNote);
});

export default notesRoutes;
