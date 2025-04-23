const express = require('express');
const router = express.Router();
const db = require('../db'); // pastikan db ini koneksi ke MySQL

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori');
    res.json(rows); // kirim data kategori
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data kategori' });
  }
});

module.exports = router;
