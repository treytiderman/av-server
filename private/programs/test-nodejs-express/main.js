const express = require('express');
const app = express();

const startupTime = Date.now()

app.get('/', async (req, res) => {
  res.status(200).json(`up time (ms) ${Date.now() - startupTime}`);
});

const port = process.env.port || 2004;
app.listen(port, () => {
  console.log(`Available at: http://localhost:${port}`)
  console.log(`Enviorment Variable "name" = ${process.env.name}`)
})
