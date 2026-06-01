const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);
router.get("/orders", adminController.getAllOrders);
router.patch(
  "/menu/:id",
  adminController.updateMenuItem
);

router.delete(
  "/menu/:id",
  adminController.deleteMenuItem
);
router.get(
  "/tables",
  adminController.getAllTables
);
router.post("/tables", adminController.createTable);
router.put("/tables/:id", adminController.updateTable);
router.delete("/tables/:id", adminController.deleteTable);

router.patch(
  "/tables/:id/status",
  adminController.updateTableStatus
);
module.exports = router;