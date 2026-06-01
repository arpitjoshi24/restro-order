const adminService = require("../services/admin.service");
const tableService = require("../services/table.service");
const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const orders = await adminService.getAllOrders(status);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateMenuItem = async (req, res) => {
  try {
    const item = await adminService.updateMenuItem(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await adminService.deleteMenuItem(
      req.params.id
    );

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tables
const getAllTables = async (req, res) => {
  try {
    const tables = await adminService.getAllTables();

    res.status(200).json({
      success: true,
      tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Table Status
const updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const table = await adminService.updateTableStatus(
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTable = async (req, res) => {
  try {
    const table = await tableService.createTable(req.body);

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTable = async (req, res) => {
  try {
    const table = await tableService.updateTable(
      req.params.id,
      req.body.table_number
    );

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTable = async (req, res) => {
  try {
    await tableService.deleteTable(req.params.id);

    res.status(200).json({
      success: true,
      message: "Table deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
   updateMenuItem,
  deleteMenuItem,
   getAllTables,
  updateTableStatus,
  createTable,
  updateTable,
  deleteTable,
};