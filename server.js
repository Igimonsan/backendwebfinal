const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder untuk akses gambar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Tes koneksi database
const db = require("./db");
db.getConnection()
  .then(() => console.log("✅ Terhubung ke database"))
  .catch((err) => {
    console.error("❌ Gagal terhubung ke database:", err);
    process.exit(1); // Stop server jika database tidak terkoneksi
  });

// Routes
app.use("/api/produk", require("./routes/produk"));
app.use("/api/kategori", require("./routes/kategori"));
app.use("/api/login", require("./routes/login"));
app.use("/api/testimoni", require("./routes/testimoni"));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
