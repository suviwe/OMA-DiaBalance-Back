import promisePool from '../utils/database.js';

/**
 * Hae kaikki potilas-hoitaja -suhteet
 * @returns {Array} kaikki potilas-hoitaja -suhteet
 */
const selectAllPatientHealthcareRelationships = async () => {
  const [rows] = await promisePool.query('SELECT * FROM potilas_hoitaja');
  return rows;
};

/**
 * Hae hoitajan kaikki potilaat
 * @param {number} healthcareId - hoitajan ID
 * @returns {Array} hoitajan potilaat
 */
const selectPatientsByHealthcare = async (healthcareId) => {
  const [rows] = await promisePool.query(
    `SELECT u.kayttaja_id, u.kayttajanimi, u.kayttajarooli 
     FROM potilas_hoitaja ph
     JOIN user u ON ph.potilas = u.kayttaja_id
     WHERE ph.hoidonseujaaja = ?`,
    [healthcareId]
  );
  return rows;
};

/**
 * Hae potilaan kaikki hoitajat
 * @param {number} patientId - potilaan ID
 * @returns {Array} potilaan hoitajat
 */
const selectHealthcaresByPatient = async (patientId) => {
  const [rows] = await promisePool.query(
    `SELECT u.kayttaja_id, u.kayttajanimi, u.kayttajarooli 
     FROM potilas_hoitaja ph
     JOIN user u ON ph.hoidonseujaaja = u.kayttaja_id
     WHERE ph.potilas = ?`,
    [patientId]
  );
  return rows;
};

/**
 * Tarkista onko potilas määritetty hoitajalle
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @returns {boolean} true jos suhde on olemassa
 */
const checkPatientHealthcareRelationship = async (healthcareId, patientId) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM potilas_hoitaja WHERE hoidonseujaaja = ? AND potilas = ?',
    [healthcareId, patientId]
  );
  return rows.length > 0;
};

/**
 * Lisää uusi potilas-hoitaja -suhde
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @returns {Object} tulosviesti
 */
const insertPatientHealthcareRelationship = async (healthcareId, patientId) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO potilas_hoitaja (hoidonseujaaja, potilas) VALUES (?, ?)',
      [healthcareId, patientId]
    );
    return { message: 'Potilas-hoitaja -suhde lisätty', result };
  } catch (error) {
    console.error('Error insertPatientHealthcareRelationship:', error);
    throw new Error('Database error');
  }
};

/**
 * Poista potilas-hoitaja -suhde
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @returns {Object} tulosviesti
 */
const deletePatientHealthcareRelationship = async (healthcareId, patientId) => {
  try {
    await promisePool.query(
      'DELETE FROM potilas_hoitaja WHERE hoidonseujaaja = ? AND potilas = ?',
      [healthcareId, patientId]
    );
    return { message: 'Potilas-hoitaja -suhde poistettu' };
  } catch (error) {
    console.error('Error deletePatientHealthcareRelationship:', error);
    return { error: error.message };
  }
};

export {
  selectAllPatientHealthcareRelationships,
  selectPatientsByHealthcare,
  selectHealthcaresByPatient,
  checkPatientHealthcareRelationship,
  insertPatientHealthcareRelationship,
  deletePatientHealthcareRelationship
};