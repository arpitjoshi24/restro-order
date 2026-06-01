const pool = require("../config/db");

// Create Category
const createCategory = async (data) => {
  const { name } = data;

  const existing = await pool.query(
    "SELECT * FROM categories WHERE name = $1",
    [name]
  );

  if (existing.rows.length > 0) {
    throw new Error("Category already exists");
  }

  const result = await pool.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );

  return result.rows[0];
};

// Get All Categories
const getCategories = async () => {
  const result = await pool.query(
    "SELECT * FROM categories ORDER BY name ASC"
  );

  return result.rows;
};
// Update Category
const updateCategory = async (id, name) => {
  const result = await pool.query(
    `
    UPDATE categories
    SET name = $1
    WHERE id = $2
    RETURNING *
    `,
    [name, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0];
};

// Delete Category
const deleteCategory = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM categories
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0];
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};