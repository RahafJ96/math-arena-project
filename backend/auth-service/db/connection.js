const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = connection.promise();

async function getUsers() {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    console.log(rows);
  } catch (err) {
    console.error("Query error:", err);
  }
}
getUsers();

module.exports = db;
