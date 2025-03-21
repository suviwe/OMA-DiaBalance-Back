import express from 'express';

const hostname = 'localhost';
const app = express();
const port = 3000;

// Perus reitti
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!, tämä on Suvin oma backend kokeilu');
});

// palvelimen käynnistys lopuksi kaikkien määritysten jälkeen
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });