const menuService = require("../services/menu.service");

// Create Menu Item
const createMenuItem = async (req, res) => {
  try {
    const item = await menuService.createMenuItem(req.body);

    res.status(201).json({
      success: true,
      item,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Menu Items
const getMenuItems = async (req, res) => {
  try {
    const items = await menuService.getMenuItems();

    res.status(200).json({
      success: true,
      items,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const updateMenuItem = async (req, res) => {
  try {
    const item = await menuService.updateMenuItem(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await menuService.deleteMenuItem(
      req.params.id
    );

    res.status(200).json({
      success: true,
      item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};