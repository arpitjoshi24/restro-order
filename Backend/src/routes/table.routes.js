const express = require("express");
const router = express.Router();

const tableController = require("../controllers/table.controller");

router.post("/", tableController.createTable);
router.get("/", tableController.getTables);
router.get("/:id", tableController.getTable);
router.patch("/:id/status", tableController.updateStatus);
router.put("/:id", tableController.updateTable);
router.delete("/:id", tableController.deleteTable);
module.exports = router;