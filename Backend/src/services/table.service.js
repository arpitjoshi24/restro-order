const pool = require("../config/db");
const qrService = require("./qr.service");

// Create Table
const createTable = async (data) => {
  const { table_number } = data;

  const existing = await pool.query(
    "SELECT * FROM tables WHERE table_number = $1",
    [table_number]
  );

  if (existing.rows.length > 0) {
    throw new Error("Table already exists");
  }

  // Generate QR Code
  const qrCode = await qrService.generateQrCode(table_number);

  const result = await pool.query(
    `INSERT INTO tables (table_number, qr_code)
     VALUES ($1, $2)
     RETURNING *`,
    [table_number, qrCode]
  );

  return result.rows[0];
};

// Get All Tables
const getTables = async () => {
  const result = await pool.query(
    `SELECT * FROM tables
     ORDER BY table_number ASC`
  );

  return result.rows;
};

// Get Single Table
const getTableById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM tables WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

// Update Status
const updateTableStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE tables
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

// Update Table Number
const updateTable = async (id, table_number) => {
  const result = await pool.query(
    `UPDATE tables
     SET table_number = $1
     WHERE id = $2
     RETURNING *`,
    [table_number, id]
  );

  return result.rows[0];
};

// Delete Table
const deleteTable = async (id) => {
  await pool.query(
    `DELETE FROM tables
     WHERE id = $1`,
    [id]
  );
};

module.exports = {
  createTable,
  getTables,
  getTableById,
  updateTableStatus,
    updateTable,
  deleteTable,

};