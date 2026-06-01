const orderService = require("../services/order.service");

// CREATE ORDER (with socket support)
const createOrder = async (req, res) => {
  try {
    // 🔥 get socket instance from app
    const io = req.app.get("io");

    // 🔥 pass io to service
    const order = await orderService.createOrder(req.body, io);

    // 🔥 emit real-time event (optional extra safety)
    io.emit("new_order", order);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE STATUS (also emit live update)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(
      req.params.id,
      status
    );

    // 🔥 SOCKET LIVE UPDATE
    const io = req.app.get("io");
    io.emit("order_status_updated", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};