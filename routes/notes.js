import { Router } from "express";
import { getAllNotes, addNote } from "../data/notesStore.js";
import { randomUUID } from "crypto";
import { validateNote } from "../validation/validateNote.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";

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
    return sendError(res, 404, "ID not found");
  }

  return res.status(200).json({ foundNote });
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return sendError(res, 400, "Requires title and content");
  }

  // ==== VALIDATION ==== //

  const errors = validateNote({ title, content });

  if (errors.length > 0) {
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
  return res.status(201).json(newNote);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const notes = getAllNotes();
  const { title, content } = req.body;

  if (!title && !content) {
    return sendError(res, 400, "At least one field must be modified");
  }

  let foundNote = null;

  for (const note of notes) {
    if (note.id === id) {
      foundNote = note;
      break;
    }
  }

  if (!foundNote) {
    return sendError(res, 404, "ID not found");
  }

  // ==== VALIDATION ==== //

  const errors = validateNote({ title, content });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // ==== VALIDATION ==== //

  if (title !== undefined) {
    foundNote.title = title;
  }

  if (content !== undefined) {
    foundNote.content = content;
  }

  return res.status(200).json(foundNote);
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
    return sendError(res, 404, "ID not found");
  }

  notes.splice(foundIndex, 1);

  return sendResponse(res, 200, "Note successfully deleted");
});

export default router;
