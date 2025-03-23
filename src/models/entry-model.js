import promisePool from '../utils/database.js';

/**
 * Hae kaikki kirjaukset
 * @returns {Array} kaikki kirjaukset
 */
const selectAllEntries = async () => {
  const [rows] = await promisePool.query('SELECT * FROM kirjaus');
  return rows;
};

/**
 * Hae kirjaukset käyttäjän ID:n perusteella
 * @param {number} userId
 * @returns {Array} käyttäjän kirjaukset
 */
const selectEntriesByUserId = async (userId) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM kirjaus WHERE kayttaja_id = ?',
    [userId]
  );
  return rows;
};

/**
 * Hae kirjaus päivämäärän ja käyttäjä-ID:n perusteella
 * @param {string} date - päivämäärä muodossa YYYY-MM-DD
 * @param {number} userId - käyttäjän ID
 * @returns {Object} kirjauksen tiedot
 */
const selectEntryByDateAndUserId = async (date, userId) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM kirjaus WHERE pvm = ? AND kayttaja_id = ?',
    [date, userId]
  );
  return rows[0];
};

/**
 * Lisää uusi kirjaus
 * @param {Object} entry - kirjauksen tiedot
 * @returns {Object} tulosviesti
 */
const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      `INSERT INTO kirjaus (
        pvm, 
        kayttaja_id, 
        hrv_data, 
        vs_aamu, 
        vs_ilta, 
        vs_aamupala_ennen, 
        vs_aamupala_jalkeen, 
        vs_lounas_ennen, 
        vs_lounas_jalkeen, 
        vs_valipala_ennen, 
        vs_valipala_jalkeen, 
        vs_paivallinen_ennen, 
        vs_paivallinen_jalkeen, 
        vs_iltapala_ennen, 
        vs_iltapala_jalkeen, 
        oireet, 
        kommentti
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.pvm,
        entry.kayttaja_id,
        entry.hrv_data,
        entry.vs_aamu,
        entry.vs_ilta,
        entry.vs_aamupala_ennen,
        entry.vs_aamupala_jalkeen,
        entry.vs_lounas_ennen,
        entry.vs_lounas_jalkeen,
        entry.vs_valipala_ennen,
        entry.vs_valipala_jalkeen,
        entry.vs_paivallinen_ennen,
        entry.vs_paivallinen_jalkeen,
        entry.vs_iltapala_ennen,
        entry.vs_iltapala_jalkeen,
        entry.oireet,
        entry.kommentti
      ]
    );
    return { message: 'Kirjaus lisätty', result };
  } catch (error) {
    console.error('Error insertEntry:', error);
    throw new Error('Database error');
  }
};

/**
 * Päivitä kirjaus
 * @param {string} date - päivämäärä
 * @param {number} userId - käyttäjän ID
 * @param {Object} entry - päivitettävät tiedot
 * @returns {Object} tulosviesti
 */
const updateEntry = async (date, userId, entry) => {
  try {
    // Rakennetaan päivityslause dynaamisesti päivitettävien kenttien perusteella
    const updateFields = [];
    const values = [];

    // Käydään läpi kaikki mahdolliset kentät
    const fields = [
      'hrv_data', 'vs_aamu', 'vs_ilta', 
      'vs_aamupala_ennen', 'vs_aamupala_jalkeen', 
      'vs_lounas_ennen', 'vs_lounas_jalkeen',
      'vs_valipala_ennen', 'vs_valipala_jalkeen',
      'vs_paivallinen_ennen', 'vs_paivallinen_jalkeen',
      'vs_iltapala_ennen', 'vs_iltapala_jalkeen',
      'oireet', 'kommentti'
    ];

    fields.forEach(field => {
      if (entry[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(entry[field]);
      }
    });

    if (updateFields.length === 0) {
      return { error: 'Ei päivitettäviä kenttiä' };
    }

    // Lisätään WHERE-ehtojen arvot
    values.push(date);
    values.push(userId);

    const [result] = await promisePool.query(
      `UPDATE kirjaus SET ${updateFields.join(', ')} WHERE pvm = ? AND kayttaja_id = ?`,
      values
    );

    return { message: 'Kirjaus päivitetty', result };
  } catch (error) {
    console.error('Error updateEntry:', error);
    return { error: 'Database error' };
  }
};

/**
 * Poista kirjaus
 * @param {string} date - päivämäärä
 * @param {number} userId - käyttäjän ID
 * @returns {Object} tulosviesti
 */
const deleteEntry = async (date, userId) => {
  try {
    await promisePool.query(
      'DELETE FROM kirjaus WHERE pvm = ? AND kayttaja_id = ?',
      [date, userId]
    );
    return { message: 'Kirjaus poistettu' };
  } catch (error) {
    console.error('Error deleteEntry:', error);
    return { error: error.message };
  }
};

export {
  selectAllEntries,
  selectEntriesByUserId,
  selectEntryByDateAndUserId,
  insertEntry,
  updateEntry,
  deleteEntry
};