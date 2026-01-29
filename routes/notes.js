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

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Requires title and content" });
  }

  const errors = [];

  if (typeof title !== "string") {
    errors.push({ field: "title", message: "Title must be a string" });
  } else {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      errors.push({ field: "title", message: "Title must not be empty" });
    }

    if (trimmedTitle.length > 101) {
      errors.push({ field: "title", message: "Title must not exceed 100 characters" });
    }
  }

  if (typeof content !== "string") {
    errors.push({ field: "content", message: "Content must be a string" });
  } else {
    const contentTrimmed = content.trim();

    if (contentTrimmed.length === 0) {
      errors.push({ field: "content", message: "Content must not be empty" });
    }

    if (contentTrimmed.length > 1001) {
      errors.push({ field: "content", message: "Content must not exceed 1000 characters" });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // ----------------------------- //

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
  const id = req.params.id;
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

  if (title) {
    foundNote.title = title;
  }

  if (content) {
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
