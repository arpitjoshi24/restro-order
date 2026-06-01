const pool = require("../config/db");

// Create Menu Item
const createMenuItem = async (data) => {
  const { name, price, category_id } = data;

  const result = await pool.query(
    `INSERT INTO menu_items (name, price, category_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, price, category_id]
  );

  return result.rows[0];
};

// Get All Menu Items
const getMenuItems = async () => {
  const result = await pool.query(
    `SELECT
        m.id,
        m.name,
        m.price,
        m.available,
        c.name AS category_name,
        c.id AS category_id
     FROM menu_items m
     LEFT JOIN categories c
     ON m.category_id = c.id
     ORDER BY m.name ASC`
  );

  return result.rows;
};
const updateMenuItem = async (id, data) => {
  const { name, price, category_id, available } = data;

  const result = await pool.query(
    `UPDATE menu_items
     SET name = $1,
         price = $2,
         category_id = $3,
         available = $4
     WHERE id = $5
     RETURNING *`,
    [name, price, category_id, available, id]
  );

  return result.rows[0];
};

const deleteMenuItem = async (id) => {
  const result = await pool.query(
    `DELETE FROM menu_items
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};