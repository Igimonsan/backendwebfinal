const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',          // ganti jika user MySQL kamu bukan 'root'
  password: '',          // kosongkan jika root tidak pakai password
  database: 'igimonsan_store'  // pastikan nama database sesuai
});

module.exports = db;
