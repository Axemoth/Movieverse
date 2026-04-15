import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

// Import Modular Routes
import authRoutes from "./src/routes/auth.mjs";
import seatRoutes from "./src/routes/seats.mjs";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8080;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "public"))); // Serve frontend files

// Health check / Redirect to UI
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Mounting Routes
app.use("/", authRoutes);  // /register, /login
app.use("/", seatRoutes);  // /seats, /:id/:name

app.listen(port, () => {
  console.log(`========================================`);
  console.log(`  ChaiCode Cinema Server Is Running!`);
  console.log(`  URL: http://localhost:${port}`);
  console.log(`========================================`);
});
