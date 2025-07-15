const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Hello, Sanni!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
