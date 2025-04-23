const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Setup multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Ambil semua produk
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        produk.id, 
        produk.nama_produk AS nama, 
        produk.harga_per_1000 AS harga, 
        produk.deskripsi AS gambar, 
        kategori.nama_kategori AS kategori 
      FROM produk 
      JOIN kategori ON produk.id_kategori = kategori.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
});

// Tambah produk baru
router.post('/', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_produk, harga_per_1000, id_kategori } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nama_produk || !harga_per_1000 || !id_kategori || !gambar) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    await db.query(
      'INSERT INTO produk (nama_produk, harga_per_1000, deskripsi, id_kategori) VALUES (?, ?, ?, ?)',
      [nama_produk, harga_per_1000, gambar, id_kategori]
    );

    res.status(201).json({ message: 'Produk berhasil ditambahkan' });
  } catch (error) {
    console.error('❗ Error saat menambahkan produk:', error);
    res.status(500).json({ message: 'Gagal menambahkan produk' });
  }
});

// Hapus produk
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM produk WHERE id = ?', [id]);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('❗ Error saat menghapus produk:', error);
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
});

// Edit produk
router.put('/:id', upload.single('gambar'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga_per_1000, id_kategori } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nama_produk || !harga_per_1000 || !id_kategori) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const query = gambar
      ? 'UPDATE produk SET nama_produk = ?, harga_per_1000 = ?, deskripsi = ?, id_kategori = ? WHERE id = ?'
      : 'UPDATE produk SET nama_produk = ?, harga_per_1000 = ?, id_kategori = ? WHERE id = ?';
    const values = gambar
      ? [nama_produk, harga_per_1000, gambar, id_kategori, id]
      : [nama_produk, harga_per_1000, id_kategori, id];

    await db.query(query, values);
    res.json({ message: 'Produk berhasil diperbarui' });
  } catch (error) {
    console.error('❗ Error saat memperbarui produk:', error);
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
});

module.exports = router;
