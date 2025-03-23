import promisePool from '../utils/database.js';

/**
 * Hae kaikki käyttäjät tietokannasta
 * @returns {Array} kaikki käyttäjät
 */
const selectAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT kayttaja_id, kayttajanimi, kayttajarooli FROM user');
  console.log('selectAllUsers result', rows);
  return rows;
};

/**
 * Hae käyttäjä ID:n perusteella
 * @param {number} userId
 * @returns {Object} käyttäjätiedot
 */
const selectUserById = async (userId) => {
  const [rows] = await promisePool.query(
    'SELECT kayttaja_id, kayttajanimi, kayttajarooli FROM user WHERE kayttaja_id = ?',
    [userId]
  );
  return rows[0];
};

/**
 * Lisää uusi käyttäjä
 * @param {Object} user käyttäjätiedot
 * @returns {number} lisätyn käyttäjän ID
 */
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO user (kayttajanimi, salasana, kayttajarooli) VALUES (?, ?, ?)',
      [user.kayttajanimi, user.salasana, user.kayttajarooli]
    );
    console.log('insertUser result', result);
    return result.insertId;
  } catch (error) {
    console.error('Error insertUser:', error);
    throw new Error('Database error');
  }
};

/**
 * Hae käyttäjä käyttäjänimen ja salasanan perusteella (kirjautumista varten)
 * @param {string} kayttajanimi
 * @param {string} salasana
 * @returns {Object} käyttäjätiedot
 */
const selectUserByNameAndPassword = async (kayttajanimi, salasana) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT kayttaja_id, kayttajanimi, kayttajarooli FROM user WHERE kayttajanimi = ? AND salasana = ?',
      [kayttajanimi, salasana]
    );
    return rows[0];
  } catch (error) {
    console.error('Error selectUserByNameAndPassword:', error);
    throw new Error('Database error');
  }
};

/**
 * Hae käyttäjä käyttäjänimen perusteella
 * @param {string} kayttajanimi
 * @returns {Object} käyttäjätiedot
 */
const selectUserByUserName = async (kayttajanimi) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT kayttaja_id, kayttajanimi, salasana, kayttajarooli FROM user WHERE kayttajanimi = ?',
      [kayttajanimi]
    );
    return rows[0];
  } catch (error) {
    console.error('Error selectUserByUserName:', error);
    throw new Error('Database error');
  }
};

/**
 * Poista käyttäjä ID:n perusteella
 * @param {number} userId
 * @returns {Object} tulosviesti
 */
const deleteUserById = async (userId) => {
  try {
    await promisePool.query('DELETE FROM user WHERE kayttaja_id = ?', [userId]);
    return { message: 'Käyttäjä poistettu' };
  } catch (error) {
    console.error('Error deleteUserById:', error);
    return { error: error.message };
  }
};

/**
 * Päivitä käyttäjän tiedot ID:n perusteella
 * @param {number} userId
 * @param {Object} user päivitettävät tiedot
 * @returns {Object} tulosviesti
 */
const updateUserById = async (userId, { kayttajanimi, salasana, kayttajarooli }) => {
  try {
    let updateFields = [];
    let values = [];

    if (kayttajanimi) {
      updateFields.push('kayttajanimi = ?');
      values.push(kayttajanimi);
    }

    if (salasana) {
      updateFields.push('salasana = ?');
      values.push(salasana);
    }

    if (kayttajarooli !== undefined) {
      updateFields.push('kayttajarooli = ?');
      values.push(kayttajarooli);
    }

    if (updateFields.length === 0) {
      return { error: 'Ei päivitettäviä kenttiä' };
    }

    values.push(userId);

    const [result] = await promisePool.query(
      'UPDATE user SET ' + updateFields.join(', ') + ' WHERE kayttaja_id = ?',
      values
    );
    return { message: 'Käyttäjätietoja päivitetty', result };
  } catch (error) {
    console.error('Error updateUserById:', error);
    return { error: 'Database error' };
  }
};

export {
  selectAllUsers,
  selectUserById,
  insertUser,
  selectUserByNameAndPassword,
  deleteUserById,
  selectUserByUserName,
  updateUserById
};