import promisePool from '../utils/database.js';

// Käyttäjäroolit
const ROOLI = {
  POTILAS: 1,
  HOIDONSEURAAJA: 2,
  ADMIN: 3
};

/**
 * Hae kaikki käyttäjät tietokannasta
 * @returns {Array} kaikki käyttäjät
 */
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user');
    return rows;
  } catch (error) {
    console.error('Error getAllUsers:', error);
    throw new Error('Database error');
  }
};

/**
 * Hae käyttäjä ID:n perusteella
 * @param {number} userId
 * @returns {Object} käyttäjätiedot
 */
const getUserById = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT kayttaja_id, kayttajanimi, kayttajarooli FROM user WHERE kayttaja_id = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getUserById:', error);
    throw new Error('Database error');
  }
};

/**
 * Lisää uusi käyttäjä
 * @param {Object} user käyttäjätiedot (kayttajanimi, salasana, kayttajarooli)
 * @returns {number} lisätyn käyttäjän ID
 */
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO user (kayttajanimi, salasana, kayttajarooli) VALUES (?, ?, ?)',
      [user.kayttajanimi, user.salasana, user.kayttajarooli]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error insertUser:', error);
    throw new Error('Database error');
  }
};

/**
 * Hae käyttäjä käyttäjänimen perusteella
 * @param {string} kayttajanimi
 * @returns {Object} käyttäjätiedot
 */
const getUserByUsername = async (kayttajanimi) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT kayttaja_id, kayttajanimi, salasana, kayttajarooli FROM user WHERE kayttajanimi = ?',
      [kayttajanimi]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getUserByUsername:', error);
    throw new Error('Database error');
  }
};

/**
 * Kirjaudu sisään käyttäjänimen ja salasanan perusteella
 * @param {string} kayttajanimi
 * @param {string} salasana
 * @returns {Object} käyttäjätiedot
 */
const login = async (kayttajanimi) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT kayttaja_id, kayttajanimi, kayttajarooli FROM user WHERE kayttajanimi = ?',
      [kayttajanimi]
    );
    return rows[0];
  } catch (error) {
    console.error('Error login:', error);
    throw new Error('Database error');
  }
};

/**
 * Päivitä käyttäjän tiedot
 * @param {number} userId
 * @param {Object} userData päivitettävät tiedot
 * @returns {Object} tulosviesti
 */
const updateUser = async (userId, userData) => {
  try {
    let updateFields = [];
    let values = [];

    if (userData.kayttajanimi) {
      updateFields.push('kayttajanimi = ?');
      values.push(userData.kayttajanimi);
    }

    if (userData.salasana) {
      updateFields.push('salasana = ?');
      values.push(userData.salasana);
    }

    if (userData.kayttajarooli !== undefined) {
      updateFields.push('kayttajarooli = ?');
      values.push(userData.kayttajarooli);
    }

    if (updateFields.length === 0) {
      return { error: 'Ei päivitettäviä kenttiä' };
    }

    values.push(userId);

    const [result] = await promisePool.query(
      'UPDATE user SET ' + updateFields.join(', ') + ' WHERE kayttaja_id = ?',
      values
    );
    
    return { 
      message: 'Käyttäjätietoja päivitetty', 
      affected: result.affectedRows 
    };
  } catch (error) {
    console.error('Error updateUser:', error);
    return { error: 'Database error' };
  }
};

/**
 * Poista käyttäjä
 * @param {number} userId
 * @returns {Object} tulosviesti
 */
const deleteUserById = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM user WHERE kayttaja_id = ?',
      [userId]
    );
    
    return { 
      message: 'Käyttäjä poistettu', 
      affected: result.affectedRows 
    };
  } catch (error) {
    console.error('Error deleteUser:', error);
    return { error: 'Database error' };
  }
};

export {
  ROOLI,
  getAllUsers,
  getUserById,
  insertUser,
  getUserByUsername,
  login,
  updateUser,
  deleteUserById
};