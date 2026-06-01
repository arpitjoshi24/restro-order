const tableService = require("../services/table.service");

// Create Table
const createTable = async (req, res) => {
  try {
    const table = await tableService.createTable(req.body);

    res.status(201).json({
      success: true,
      table,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Tables
const getTables = async (req, res) => {
  try {
    const tables = await tableService.getTables();

    res.status(200).json({
      success: true,
      tables,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Table
const getTable = async (req, res) => {
  try {
    const table = await tableService.getTableById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      table,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const table = await tableService.updateTableStatus(
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      table,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Update Table Number
const updateTable = async (req, res) => {
  try {
    const { table_number } = req.body;

    const table = await tableService.updateTable(
      req.params.id,
      table_number
    );

    res.status(200).json({
      success: true,
      table,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Table
const deleteTable = async (req, res) => {
  try {
    await tableService.deleteTable(req.params.id);

    res.status(200).json({
      success: true,
      message: "Table deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createTable,
  getTables,
  getTable,
  updateStatus,
   updateTable,
  deleteTable,
};