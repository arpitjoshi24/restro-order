const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menu.controller");

router.post("/", menuController.createMenuItem);
router.get("/", menuController.getMenuItems);
router.put("/:id", menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;