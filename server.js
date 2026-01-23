import express from "express";
import healthRoutes from "./routes/health";

// initializes app through express
const app = express();

// defines port
const PORT = 3000;

// registers routes
app.use(healthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
