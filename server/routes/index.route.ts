import { sql } from "@/db";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  req.log.info("Processing request to homepage");
  res.send("Hello World!");
});

router.get("/health", async (req, res) => {
  try {
    await sql`SELECT 1`;
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

export default router;
