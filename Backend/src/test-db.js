const pool = require("./config/db");

async function test() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB Connected ✔", result.rows[0]);
  } catch (err) {
    console.error("DB Error ❌", err);
  } finally {
    process.exit();
  }
}

test();