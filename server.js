import express from "express";
import healthRoutes from "./routes/health";
import notesRoutes from "./routes/notes";

// initializes app through express
const app = express();

// defines port
const PORT = 3000;

// middleware to parse json
app.use(express.json());

// health check route
app.use("/health", healthRoutes);

// notes api route
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
