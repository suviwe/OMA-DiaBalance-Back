import express from 'express';
import userRouter from './routes/user-router.js';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';


const hostname = 'localhost';
const app = express();
const port = process.env.PORT || 3000;

// Middlewaret
app.use(cors()); // sallii pyynnöt frontendistä (esim. localhost:5173)
app.use(express.json()); 

// Perus reitti (testausta varten)
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!, tämä on Suvin oma backend kokeilu');
});

// Käyttäjäreitit käyttöön (nyt osoitteessa /api/users)
app.use('/api/users', userRouter);





app.use(notFoundHandler);
app.use(errorHandler);

// palvelimen käynnistys lopuksi
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
