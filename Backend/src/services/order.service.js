const pool = require("../config/db");

const createOrder = async (data) => {
  const { table_number, items } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tableResult = await client.query(
      `SELECT id FROM tables WHERE table_number = $1`,
      [table_number]
    );

    if (tableResult.rows.length === 0) {
      throw new Error("Table not found");
    }

    const table_id = tableResult.rows[0].id;

    let total = 0;
    const processedItems = [];

    for (const item of items) {
      const menuResult = await client.query(
        `SELECT price FROM menu_items WHERE id = $1`,
        [item.menu_item_id]
      );

      if (menuResult.rows.length === 0) {
        throw new Error("Menu item not found");
      }

      const price = menuResult.rows[0].price;

      total += price * item.quantity;

      processedItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price,
      });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (table_id, total)
       VALUES ($1, $2)
       RETURNING *`,
      [table_id, total]
    );

    const order = orderResult.rows[0];

    for (const item of processedItems) {
      await client.query(
        `INSERT INTO order_items
         (order_id, menu_item_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.menu_item_id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    const fullOrderResult = await pool.query(
      `
      SELECT o.*, t.table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      WHERE o.id = $1
      `,
      [order.id]
    );

    const itemsResult = await pool.query(
      `
      SELECT 
        m.name,
        oi.quantity,
        oi.price
      FROM order_items oi
      JOIN menu_items m ON m.id = oi.menu_item_id
      WHERE oi.order_id = $1
      `,
      [order.id]
    );

    const fullOrder = {
      ...fullOrderResult.rows[0],
      items: itemsResult.rows,
    };

    return fullOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const getOrders = async () => {
  const result = await pool.query(`
    SELECT o.*, t.table_number
    FROM orders o
    LEFT JOIN tables t ON o.table_id = t.id
    ORDER BY o.created_at DESC
  `);

  const orders = result.rows;

  for (let order of orders) {
    const items = await pool.query(
      `
      SELECT m.name, oi.quantity, oi.price
      FROM order_items oi
      JOIN menu_items m ON m.id = oi.menu_item_id
      WHERE oi.order_id = $1
      `,
      [order.id]
    );

    order.items = items.rows;
  }

  return orders;
};

const updateOrderStatus = async (id, status) => {
  const allowed = ["PENDING", "PREPARING", "READY", "SERVED", "CANCELLED"];

  if (!allowed.includes(status)) {
    throw new Error("Invalid status");
  }

  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};