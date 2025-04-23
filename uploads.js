const [gambar, setGambar] = useState(null);

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('harga', harga);
  formData.append('kategori', kategori);
  formData.append('gambar', gambar); // file

  await axios.post('http://localhost:5000/api/produk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
// routes/testimoni.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/testimoni");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/api/testimoni", upload.single("gambar"), (req, res) => {
  const deskripsi = req.body.deskripsi;
  const gambarPath = `/uploads/testimoni/${req.file.filename}`;

  // Simpan ke DB jika perlu
  console.log("Deskripsi:", deskripsi);
  console.log("Gambar:", gambarPath);

  res.json({ message: "Testimoni berhasil diupload", path: gambarPath });
});

module.exports = router;

