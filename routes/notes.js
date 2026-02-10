import { Router } from "express";
import { getAllNotes, addNote } from "../data/notesStore.js";
import { randomUUID } from "crypto";
import { validateNote } from "../validation/validateNote.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const notes = getAllNotes();
    return res.status(200).json({ notes });
  } catch (err) {
    console.error("GET/notes ", err);
    return sendError(res, 500, "Database Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
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
  } catch (err) {
    console.error("GET/notes/:id ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.post("/", async (req, res) => {
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

  try {
    const newNote = {
      id: randomUUID(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    addNote(newNote);
    return res.status(201).json(newNote);
  } catch (err) {
    console.error("POST/notes ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const notes = getAllNotes();
  const { title, content } = req.body;

  if (!title && !content) {
    return sendError(res, 400, "At least one field must be modified");
  }

  // ==== VALIDATION ==== //

  const errors = validateNote({ title, content });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // ==== VALIDATION ==== //

  try {
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

    if (title !== undefined) {
      foundNote.title = title;
    }

    if (content !== undefined) {
      foundNote.content = content;
    }

    return res.status(200).json(foundNote);
  } catch (err) {
    console.error("PUT/notes/:id ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
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
  } catch (err) {
    console.error("DELETE/:id ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

export default router;
