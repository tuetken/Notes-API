import { Router } from "express";
import { validateNote } from "../validation/validateNote.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";
import Note from "../models/Note.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json({ notes });
  } catch (err) {
    console.error("GET/notes ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return sendError(res, 404, "ID Not Found");
    }

    return res.status(200).json({ note });
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
    const note = await Note.create({ title, content });
    return res.status(201).json({ note });
  } catch (err) {
    console.error("POST/notes ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
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
    const note = await Note.findById(id);

    if (!note) {
      return sendError(res, 404, "ID not found");
    }

    if (title !== undefined) {
      note.title = title;
    }

    if (content !== undefined) {
      note.content = content;
    }

    await note.save();

    return res.status(200).json({ note });
  } catch (err) {
    console.error("PUT/notes/:id ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return sendError(res, 404, "ID not found");
    }

    return sendResponse(res, 200, "Note successfully deleted");
  } catch (err) {
    console.error("DELETE/:id ", err);
    return sendError(res, 500, "Internal Server Error");
  }
});

export default router;
