const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const categoryRoutes = require("./routes/category.routes");
const tableRoutes = require("./routes/table.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant API Running");
});

module.exports = app;