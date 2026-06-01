const pool = require("../config/db");
const bcrypt = require("bcrypt");

const register = async (data) => {
  const { name, email, password, role } = data;

  // check if user exists
  const userExists = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userExists.rows.length > 0) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, hashedPassword, role || "STAFF"]
  );

  return result.rows[0];
};



const jwt = require("jsonwebtoken");

const login = async (data) => {
  const { email, password } = data;

  // check user exists
  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  // check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // create JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

module.exports = { register, login };