import promisePool from '../utils/database.js';

/**
 * Hae kaikki ajanvaraukset
 * @returns {Array} kaikki ajanvaraukset
 */
const selectAllAppointments = async () => {
  const [rows] = await promisePool.query('SELECT * FROM ajanvaraus');
  return rows;
};

/**
 * Hae hoitajan kaikki ajanvaraukset
 * @param {number} healthcareId - hoitajan ID
 * @returns {Array} hoitajan ajanvaraukset
 */
const selectAppointmentsByHealthcare = async (healthcareId) => {
  const [rows] = await promisePool.query(
    `SELECT a.*, u.kayttajanimi as potilas_nimi
     FROM ajanvaraus a
     JOIN user u ON a.potilas = u.kayttaja_id
     WHERE a.hoidonseujaaja = ?
     ORDER BY a.ajanvaraus_pvm, a.ajanvaraus_aloitus`,
    [healthcareId]
  );
  return rows;
};

/**
 * Hae potilaan kaikki ajanvaraukset
 * @param {number} patientId - potilaan ID
 * @returns {Array} potilaan ajanvaraukset
 */
const selectAppointmentsByPatient = async (patientId) => {
  const [rows] = await promisePool.query(
    `SELECT a.*, u.kayttajanimi as hoitaja_nimi
     FROM ajanvaraus a
     JOIN user u ON a.hoidonseujaaja = u.kayttaja_id
     WHERE a.potilas = ?
     ORDER BY a.ajanvaraus_pvm, a.ajanvaraus_aloitus`,
    [patientId]
  );
  return rows;
};

/**
 * Hae ajanvaraus hoitajan, potilaan ja päivämäärän perusteella
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @param {string} date - päivämäärä muodossa YYYY-MM-DD
 * @returns {Object} ajanvarauksen tiedot
 */
const selectAppointmentByIds = async (healthcareId, patientId, date) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM ajanvaraus WHERE hoidonseujaaja = ? AND potilas = ? AND ajanvaraus_pvm = ?',
    [healthcareId, patientId, date]
  );
  return rows[0];
};

/**
 * Hae hoitajan ajanvaraukset tietylle päivälle
 * @param {number} healthcareId - hoitajan ID
 * @param {string} date - päivämäärä muodossa YYYY-MM-DD
 * @returns {Array} päivän ajanvaraukset
 */
const selectAppointmentsByHealthcareAndDate = async (healthcareId, date) => {
  const [rows] = await promisePool.query(
    `SELECT a.*, u.kayttajanimi as potilas_nimi
     FROM ajanvaraus a
     JOIN user u ON a.potilas = u.kayttaja_id
     WHERE a.hoidonseujaaja = ? AND a.ajanvaraus_pvm = ?
     ORDER BY a.ajanvaraus_aloitus`,
    [healthcareId, date]
  );
  return rows;
};

/**
 * Lisää uusi ajanvaraus
 * @param {Object} appointment - ajanvarauksen tiedot
 * @returns {Object} tulosviesti
 */
const insertAppointment = async (appointment) => {
  try {
    const [result] = await promisePool.query(
      `INSERT INTO ajanvaraus 
      (hoidonseujaaja, potilas, ajanvaraus_pvm, ajanvaraus_aloitus, ajanvaraus_lopetus) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        appointment.hoidonseujaaja,
        appointment.potilas,
        appointment.ajanvaraus_pvm,
        appointment.ajanvaraus_aloitus,
        appointment.ajanvaraus_lopetus
      ]
    );
    return { message: 'Ajanvaraus lisätty', result };
  } catch (error) {
    console.error('Error insertAppointment:', error);
    throw new Error('Database error');
  }
};

/**
 * Päivitä ajanvaraus
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @param {string} date - päivämäärä
 * @param {Object} appointment - päivitettävät tiedot
 * @returns {Object} tulosviesti
 */
const updateAppointment = async (healthcareId, patientId, date, appointment) => {
  try {
    const updateFields = [];
    const values = [];

    if (appointment.ajanvaraus_aloitus) {
      updateFields.push('ajanvaraus_aloitus = ?');
      values.push(appointment.ajanvaraus_aloitus);
    }

    if (appointment.ajanvaraus_lopetus) {
      updateFields.push('ajanvaraus_lopetus = ?');
      values.push(appointment.ajanvaraus_lopetus);
    }

    if (updateFields.length === 0) {
      return { error: 'Ei päivitettäviä kenttiä' };
    }

    // Lisätään WHERE-ehtojen arvot
    values.push(healthcareId);
    values.push(patientId);
    values.push(date);

    const [result] = await promisePool.query(
      `UPDATE ajanvaraus SET ${updateFields.join(', ')} 
       WHERE hoidonseujaaja = ? AND potilas = ? AND ajanvaraus_pvm = ?`,
      values
    );

    return { message: 'Ajanvaraus päivitetty', result };
  } catch (error) {
    console.error('Error updateAppointment:', error);
    return { error: 'Database error' };
  }
};

/**
 * Poista ajanvaraus
 * @param {number} healthcareId - hoitajan ID
 * @param {number} patientId - potilaan ID
 * @param {string} date - päivämäärä
 * @returns {Object} tulosviesti
 */
const deleteAppointment = async (healthcareId, patientId, date) => {
  try {
    await promisePool.query(
      'DELETE FROM ajanvaraus WHERE hoidonseujaaja = ? AND potilas = ? AND ajanvaraus_pvm = ?',
      [healthcareId, patientId, date]
    );
    return { message: 'Ajanvaraus poistettu' };
  } catch (error) {
    console.error('Error deleteAppointment:', error);
    return { error: error.message };
  }
};

export {
  selectAllAppointments,
  selectAppointmentsByHealthcare,
  selectAppointmentsByPatient,
  selectAppointmentByIds,
  selectAppointmentsByHealthcareAndDate,
  insertAppointment,
  updateAppointment,
  deleteAppointment
};