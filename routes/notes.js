import { Router } from "express";
import { getAllNotes, addNote } from "../data/notesStore.js";
import { randomUUID } from "crypto";
import { validateNote } from "../validation/validateNote.js";

const router = Router();

router.get("/", (req, res) => {
  const notes = getAllNotes();
  res.status(200).json({ notes });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const notes = getAllNotes();
  let foundNote = null;

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

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Requires title and content" });
  }

  // ==== VALIDATION ==== //

  const errors = validateNote({ title, content });

  if (errors > 0) {
    return res.status(400).json({ errors });
  }

  // ==== VALIDATION ==== //

  const newNote = {
    id: randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  addNote(newNote);
  res.status(201).json(newNote);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const notes = getAllNotes();
  const { title, content } = req.body;

  if (!title && !content) {
    res.status(400).json({ error: "At least one field must be modified" });
  }

  let foundNote = null;

  for (const note of notes) {
    if (note.id === id) {
      foundNote = note;
      break;
    }
  }

  if (!foundNote) {
    return res.status(404).json({ error: "ID not found" });
  }

  // ==== VALIDATION ==== //

  const errors = validateNote({ title, content });

  if (errors > 0) {
    res.status(400).json({ errors });
  }

  // ==== VALIDATION ==== //

  if (title !== undefined) {
    foundNote.title = title;
  }

  if (content !== undefined) {
    foundNote.content = content;
  }

  res.status(200).json(foundNote);
});

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
