const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello There! - from Raymond');
});

app.listen(process.env.PUBLIC_PORT, () => {
  console.log('Server running');
});
