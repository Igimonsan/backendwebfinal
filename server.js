const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (supaya gambar di folder uploads bisa diakses)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Koneksi database
const db = require("./db");
db.getConnection()
  .then(() => console.log("Terhubung ke database"))
  .catch((err) => console.error("Gagal terhubung ke database:", err));

// Routes
const produkRoutes = require("./routes/produk");
const kategoriRoutes = require("./routes/kategori");
const loginRoutes = require("./routes/login");
const testimoniRoutes = require("./routes/testimoni");

app.use("/api/produk", produkRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/testimoni", testimoniRoutes); // Gunakan prefix agar lebih jelas

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
