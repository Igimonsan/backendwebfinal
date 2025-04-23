const bcrypt = require('bcrypt');

const passwordPlain = 'IhsanGaming17'; // ← ganti sesuai password asli
bcrypt.hash(passwordPlain, 10).then((hash) => {
  console.log('Password ter-hash:', hash);
});
