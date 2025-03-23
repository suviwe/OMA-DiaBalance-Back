import { 
    selectAllEntries, 
    selectEntriesByUserId, 
    selectEntryByDateAndUserId, 
    insertEntry, 
    updateEntry, 
    deleteEntry 
  } from '../models/entry-model.js';
  import { customError } from '../middlewares/error-handler.js';
  
  // Hae kaikki kirjaukset - vain hoitajat voivat nähdä kaikkien kirjaukset
  const getAllEntries = async (req, res, next) => {
    try {
      // Tarkistetaan, että käyttäjä on hoitaja (kayttajarooli 2)
      if (req.user.kayttajarooli !== 2) {
        return next(customError('Ei käyttöoikeutta', 403));
      }
      
      const entries = await selectAllEntries();
      res.json(entries);
    } catch (error) {
      next(error);
    }
  };
  
  // Hae kirjaukset käyttäjän ID:n perusteella
  const getEntriesByUserId = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      
      // Tarkistetaan oikeudet - käyttäjä voi nähdä vain omat kirjauksensa, hoitaja voi nähdä omien potilaidensa kirjaukset
      if (req.user.kayttaja_id !== parseInt(userId) && req.user.kayttajarooli !== 2) {
        return next(customError('Ei käyttöoikeutta', 403));
      }
      
      // Jos on hoitaja, pitäisi tarkistaa onko potilas hänen listallaan
      // Tämä vaatisi potilas_hoitaja-taulun kyselyn
      
      const entries = await selectEntriesByUserId(userId);
      res.json(entries);
    } catch (error) {
      next(error);
    }
  };
  
  // Hae yksittäinen kirjaus päivämäärän ja käyttäjä-ID:n perusteella
  const getEntryByDateAndUserId = async (req, res, next) => {
    try {
      const { date, userId } = req.params;
      
      // Tarkistetaan oikeudet - käyttäjä voi nähdä vain omat kirjauksensa, hoitaja voi nähdä omien potilaidensa kirjaukset
      if (req.user.kayttaja_id !== parseInt(userId) && req.user.kayttajarooli !== 2) {
        return next(customError('Ei käyttöoikeutta', 403));
      }
      
      const entry = await selectEntryByDateAndUserId(date, userId);
      
      if (entry) {
        res.json(entry);
      } else {
        next(customError('Kirjausta ei löydy', 404));
      }
    } catch (error) {
      next(error);
    }
  };
  
  // Lisää uusi kirjaus
  const addEntry = async (req, res, next) => {
    console.log('addEntry request body:', req.body);
    
    try {
      // Tarkistetaan oikeudet - vain potilas voi lisätä omia kirjauksiaan
      // Jos kirjauksessa on kayttaja_id, sen täytyy täsmätä token-käyttäjään
      if (req.body.kayttaja_id && req.user.kayttaja_id !== parseInt(req.body.kayttaja_id)) {
        return next(customError('Voit lisätä vain omia kirjauksiasi', 403));
      }
      
      // Varmistetaan että kayttaja_id on määritelty
      if (!req.body.kayttaja_id) {
        req.body.kayttaja_id = req.user.kayttaja_id;
      }
      
      const result = await insertEntry(req.body);
      res.status(201).json(result);
    } catch (error) {
      return next(customError(error.message, 400));
    }
  };
  
  // Päivitä kirjaus
  const updateEntryByDateAndUserId = async (req, res, next) => {
    try {
      const { date, userId } = req.params;
      
      // Tarkistetaan oikeudet - vain potilas voi päivittää omia kirjauksiaan
      if (req.user.kayttaja_id !== parseInt(userId)) {
        return next(customError('Voit päivittää vain omia kirjauksiasi', 403));
      }
      
      const result = await updateEntry(date, userId, req.body);
      
      if (result.error) {
        return next(customError(result.error, 400));
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  // Poista kirjaus
  const deleteEntryByDateAndUserId = async (req, res, next) => {
    try {
      const { date, userId } = req.params;
      
      // Tarkistetaan oikeudet - vain potilas voi poistaa omia kirjauksiaan
      if (req.user.kayttaja_id !== parseInt(userId)) {
        return next(customError('Voit poistaa vain omia kirjauksiasi', 403));
      }
      
      const result = await deleteEntry(date, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  export {
    getAllEntries,
    getEntriesByUserId,
    getEntryByDateAndUserId,
    addEntry,
    updateEntryByDateAndUserId,
    deleteEntryByDateAndUserId
  };