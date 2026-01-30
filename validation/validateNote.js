export function validateNote({ title, content }) {
  const errors = [];

  if (title !== undefined) {
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
  }

  if (content !== undefined) {
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
  }

  return errors;
}
