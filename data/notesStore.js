const notes = [];

export function getAllNotes() {
  return notes;
}

export function addNote(note) {
  notes.push(note);
  return note;
}
