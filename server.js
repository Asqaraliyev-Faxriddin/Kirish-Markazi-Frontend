const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'html')));

app.listen(4000, () => {
  console.log('Frontend running at https://kirish-markazi-backend.onrender.com');
});
