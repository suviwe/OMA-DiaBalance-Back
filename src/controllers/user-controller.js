import { 
    selectAllUsers, 
    selectUserById, 
    insertUser, 
    deleteUserById, 
    updateUserById,
    selectUserByUserName
  } from '../models/user-model.js';
  import bcrypt from 'bcryptjs';
  import { customError } from '../middlewares/error-handler.js';
  import jwt from 'jsonwebtoken';
  import 'dotenv/config';
  
  // Kaikkien käyttäjien hakeminen
  const getUsers = async (req, res, next) => {
    try {
      const users = await selectAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
  
  // Lisää käyttäjä
  const addUser = async (req, res, next) => {
    console.log('addUser request body:', req.body);
  
    try {
      // Salasanan salaus
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.salasana, salt);
      
      const newUser = {
        kayttajanimi: req.body.kayttajanimi,
        salasana: hashedPassword,
        kayttajarooli: req.body.kayttajarooli
      };
      
      const result = await insertUser(newUser);
      res.status(201).json({message: 'Käyttäjä lisätty. id: ' + result});
    } catch (error) {
      return next(customError(error.message, 400));
    }
  };
  
  // Kirjautuminen
  const login = async (req, res, next) => {
    console.log('login request body:', req.body);
    try {
      const { kayttajanimi, salasana } = req.body;
      
      if (!kayttajanimi || !salasana) {
        return next(customError('Käyttäjänimi ja salasana vaaditaan', 400));
      }
      
      // Haetaan käyttäjä tietokannasta
      const user = await selectUserByUserName(kayttajanimi);
      if (!user) {
        return next(customError('Virheellinen käyttäjänimi tai salasana', 401));
      }
      
      // Tarkistetaan salasana
      const isPasswordValid = await bcrypt.compare(salasana, user.salasana);
      if (!isPasswordValid) {
        return next(customError('Virheellinen käyttäjänimi tai salasana', 401));
      }
      
      // Luodaan token
      const token = jwt.sign(
        { 
          kayttaja_id: user.kayttaja_id, 
          kayttajanimi: user.kayttajanimi,
          kayttajarooli: user.kayttajarooli 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Poistetaan salasana vastauksesta
      const { salasana: pwd, ...userWithoutPassword } = user;
      
      res.json({
        ...userWithoutPassword,
        token
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Hae käyttäjä ID:n perusteella
  const findUserById = async (req, res, next) => {
    console.log('findUserById request params:', req.params.id);
    
    try {
      const user = await selectUserById(req.params.id);
  
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
      
      // Tarkistetaan oikeudet - käyttäjä voi poistaa vain oman tilinsä
      if (req.user.kayttaja_id !== parseInt(req.params.id) && req.user.kayttajarooli !== 2) {
        return next(customError('Ei käyttöoikeutta', 403));
      }
  
      const result = await deleteUserById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  
  // Käyttäjän tietojen muokkaus ID:n perusteella
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
      const result = await updateUserById(userIdFromParams, { 
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
    login,
    findUserById, 
    deleteUser, 
    editUser 
  };