const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    console.log('Username dari frontend:', username);
    console.log('Password dari frontend:', password);

    // Cek user di database
    const [rows] = await db.query(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];
    console.log('Password di database:', user.password);

    // Cek password cocok
    const match = await bcrypt.compare(password, user.password);

    console.log('Password match?', match);

    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Jika cocok, kirim response sukses
    res.json({
      message: 'Login berhasil',
      username: user.username,
      // token: '...' // jika pakai JWT
    });

  } catch (error) {
    console.error('Terjadi error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
