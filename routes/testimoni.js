const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../db");

// Gunakan folder uploads/testimoni
const uploadDir = path.join(__dirname, "..", "uploads", "testimoni");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // maksimal 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak diizinkan"));
    }
  },
});

// POST /api/testimoni
router.post("/", upload.single("gambar"), async (req, res) => {
  const { deskripsi } = req.body;
  const file = req.file;
  const gambar = file ? `/uploads/testimoni/${file.filename}` : null;

  if (!deskripsi || !gambar) {
    return res.status(400).json({ message: "Deskripsi dan gambar wajib diisi" });
  }

  try {
    const sql = "INSERT INTO testimoni (deskripsi, gambar) VALUES (?, ?)";
    await db.query(sql, [deskripsi, gambar]);

    res.status(201).json({
      message: "Testimoni berhasil diupload",
      data: { deskripsi, gambar },
    });
  } catch (error) {
    console.error("Gagal menyimpan testimoni:", error);
    res.status(500).json({ message: "Gagal menyimpan testimoni" });
  }
});

// GET /api/testimoni
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM testimoni ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil testimoni:", error);
    res.status(500).json({ message: "Gagal mengambil testimoni" });
  }
});

// DELETE /api/testimoni/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT gambar FROM testimoni WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Testimoni tidak ditemukan" });
    }

    const gambarPath = rows[0].gambar;

    if (gambarPath) {
      const fullPath = path.join(__dirname, "..", gambarPath); // tetap aman karena folder sudah bukan di public
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.warn("Gagal menghapus file gambar:", err.message);
        }
      });
    }

    await db.query("DELETE FROM testimoni WHERE id = ?", [id]);
    res.json({ message: "Testimoni berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus testimoni:", error);
    res.status(500).json({ message: "Gagal menghapus testimoni" });
  }
});

module.exports = router;
