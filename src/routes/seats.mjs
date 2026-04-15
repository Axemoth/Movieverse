import express from "express";
import pool from "../config/db.mjs";
import { authMiddleware } from "../middleware/auth.mjs";

const router = express.Router();

// Get all seats
router.get("/seats", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY id ASC");
    res.send(result.rows);
  } catch (ex) {
    console.log(ex);
    res.status(500).send({ error: "Failed to fetch seats" });
  }
});

// Book a seat (Protected)
router.put("/:id/:name", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.user.username; // Verified from token
    
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");
      
      const sql = "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE";
      const result = await conn.query(sql, [id]);

      if (result.rowCount === 0) {
        await conn.query("ROLLBACK");
        return res.status(400).send({ error: "Seat already booked" });
      }

      const sqlU = "UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1";
      await conn.query(sqlU, [id, name]);

      await conn.query("COMMIT");
      res.send({ message: "Seat booked successfully" });
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).send({ error: "Booking operation failed" });
  }
});

export default router;
