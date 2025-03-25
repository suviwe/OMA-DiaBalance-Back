import { 
    getAllUsers, 
    getUserById, 
    insertUser,
    getUserByUsername,
    deleteUserById, 
    updateUser,
    login
  } from '../models/user-model.js';
  import bcrypt from 'bcryptjs';
  import { customError } from '../middlewares/error-handler.js';
  import jwt from 'jsonwebtoken';
  import 'dotenv/config';
  
  // Kaikkien käyttäjien hakeminen
  const getUsers = async (req, res, next) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
  
  // Lisää käyttäjä, käyttäjän rekisteröinti
  const addUser = async (req, res, next) => {
    console.log('addUser request body:', req.body);
  
    try {
      // Salasanan salaus ja sitten hashataan käyttäjän syöttämä salasana jolloin salasana tallennetaan turvallisesti
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.salasana, salt);
      
      //tehdään uusi käyttäjäobjekti
      const newUser = {
        kayttajanimi: req.body.kayttajanimi,
        salasana: hashedPassword,
        kayttajarooli: req.body.kayttajarooli
      };
      
      //käytetään insertUser funktiota lisätäksemme uusi käyttäjä
      const result = await insertUser(newUser);
      res.status(201).json({message: 'Käyttäjä lisätty. id: ' + result});
      //jos tapahtuu virhe, esim dublictate, se siirretään error-middlewareen
    } catch (error) {
      return next(customError(error.message, 400));
    }
  };

  const userLogin = async (req, res, next) => {
    //näyttää mitä käyttäjä syötti
    console.log('userLogin:',  req.body)
  
    const kayttajanimi = req.body.kayttajanimi;
    const salasana = req.body.salasana;
  
    //jos username tai password puuttuu, tulee viesti
    if (!kayttajanimi || !salasana) {
      return next(customError('käyttäjänimi tai salasana puuttuu', 400));
    }
    //haetaan käyttäjä tietokannasta käyttäjänimen perusteella
    const user = await getUserByUsername(kayttajanimi);

    //jos käyttäjä löytyy, verrataan salasanaa hashattuun salasanaan
    if (user) {
      const match = await bcrypt.compare(salasana, user.salasana);
      //jos salasana on oikein, luodaan token ja siihen sisällytetään käyttäjän id ja rooli
      if (match) {
        const token = jwt.sign({
          kayttaja_id: user.kayttaja_id,
          kayttajarooli: user.kayttajarooli
        }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN,});

        //poistetaan salasana vastauksesta turvallisuussyistä
        delete user.salasana;
        console.log('user is found', user);
  
        return res.json({message: 'Käyttäjä löytyy ja tiedot ovat oikein', user, token});
        
      }
    }
      next (customError('Bad username/password', 401));
  };
  
  
  
  // Hae käyttäjä ID:n perusteella
  const findUserById = async (req, res, next) => {
    console.log('findUserById request params:', req.params.id);
    
    try {
      const user = await getUserById(req.params.id);
  
      if (user) {
        res.json(user);
      } else {
        next(customError('Käyttäjää ei löydy', 404));
      }
    } catch (error) {
      next(error);
    }
  };
  
  // Käyttäjän poisto ID:n perusteella
  const deleteUser = async (req, res, next) => {
    try {
      console.log('deleteUser', req.params.id);
      
      // Tarkistetaan oikeudet - ylläpitäjä voi poistaa vain tilit, sekä käyttäjä voi poistaa oman tilinsä
      if (req.user.kayttaja_id !== parseInt(req.params.id) && req.user.kayttajarooli !== 3) {
        return next(customError('Ei käyttöoikeutta', 403));
      }
  
      const result = await deleteUserById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  
  // Käyttäjän tietojen muokkaus ID:n perusteella
  // Potilas voi muokata omaa profiiliaan
  // Hoidonseuraaja voi muokata omaa tai potilaiden profiileja
  const editUser = async (req, res, next) => {
    console.log('editUser request body', req.body);
  
    const userIdFromToken = req.user.kayttaja_id;
    const userIdFromParams = parseInt(req.params.id);
  
    // Tarkistetaan oikeudet
    if (userIdFromToken !== userIdFromParams && req.user.kayttajarooli !== 2) {
      return next(customError('Voit muokata vain oman profiilisi tietoja', 403));
    }
  
    try {
      // Haetaan päivitettävät tiedot
      const { kayttajanimi, salasana, kayttajarooli } = req.body;
      let hashedPassword = null;
  
      // Jos vaihdetaan salasana, se hashataan
      if (salasana) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(salasana, salt);
      }
  
      // Päivitetään tiedot tietokantaan
      const result = await updateUser(userIdFromParams, { 
        kayttajanimi, 
        salasana: hashedPassword, 
        kayttajarooli 
      });
  
      if (result.error) {
        return next(customError(result.error, 400));
      }
  
      res.status(200).json({ message: 'Käyttäjätiedot päivitetty onnistuneesti' });
    } catch (error) {
      next(error);
    }
  };
  
  export { 
    getUsers, 
    addUser, 
    userLogin,
    findUserById, 
    deleteUser, 
    editUser 
  };