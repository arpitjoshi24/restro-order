const pool = require("../config/db");

const getDashboardStats = async () => {
  const totalOrders = await pool.query(
    "SELECT COUNT(*) FROM orders"
  );

  const totalRevenue = await pool.query(
    "SELECT COALESCE(SUM(total), 0) AS revenue FROM orders"
  );

  const totalTables = await pool.query(
    "SELECT COUNT(*) FROM tables"
  );

  const totalMenuItems = await pool.query(
    "SELECT COUNT(*) FROM menu_items"
  );

  const pendingOrders = await pool.query(
    "SELECT COUNT(*) FROM orders WHERE status = 'PENDING'"
  );

  return {
    totalOrders: Number(totalOrders.rows[0].count),
    totalRevenue: Number(totalRevenue.rows[0].revenue),
    totalTables: Number(totalTables.rows[0].count),
    totalMenuItems: Number(totalMenuItems.rows[0].count),
    pendingOrders: Number(pendingOrders.rows[0].count),
  };
};


const getAllOrders = async (status) => {
  let query = `
    SELECT
      o.id,
      o.status,
      o.total,
      o.created_at,
      t.table_number,
      oi.quantity,
      oi.price,
      m.name AS item_name
    FROM orders o
    LEFT JOIN tables t
      ON o.table_id = t.id
    LEFT JOIN order_items oi
      ON o.id = oi.order_id
    LEFT JOIN menu_items m
      ON oi.menu_item_id = m.id
  `;

  const values = [];

  if (status) {
    query += ` WHERE o.status = $1`;
    values.push(status);
  }

  query += ` ORDER BY o.created_at DESC`;

  const result = await pool.query(query, values);

  const ordersMap = {};

  result.rows.forEach((row) => {
    if (!ordersMap[row.id]) {
      ordersMap[row.id] = {
        id: row.id,
        table_number: row.table_number,
        status: row.status,
        total: row.total,
        created_at: row.created_at,
        items: [],
      };
    }

    if (row.item_name) {
      ordersMap[row.id].items.push({
        name: row.item_name,
        quantity: row.quantity,
        price: row.price,
      });
    }
  });

  return Object.values(ordersMap);
};

// Update Menu Item
const updateMenuItem = async (id, data) => {
  const { name, price, category_id, available } = data;

  const result = await pool.query(
    `UPDATE menu_items
     SET
       name = $1,
       price = $2,
       category_id = $3,
       available = $4
     WHERE id = $5
     RETURNING *`,
    [name, price, category_id, available, id]
  );

  return result.rows[0];
};

// Delete Menu Item
const deleteMenuItem = async (id) => {
  const result = await pool.query(
    `DELETE FROM menu_items
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

// Get All Tables
const getAllTables = async () => {
  const result = await pool.query(`
    SELECT *
    FROM tables
    ORDER BY table_number ASC
  `);

  return result.rows;
};

// Update Table Status
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

module.exports = {
  getDashboardStats,
  getAllOrders,
   updateMenuItem,
  deleteMenuItem,
    getAllTables,
  updateTableStatus,
};