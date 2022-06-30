import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "pg";
const { Pool } = pkg;

import cors from "cors";
const PORT = process.env.PORT || 8000;
const app = express();
//CROSS ORIGIN RESOURCE SHARING

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  } else {
    console.log("database connection established");
    client.query(
      `SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema='public'
                    AND table_type='BASE TABLE';
        `,
      (err, result) => {
        release();
        if (err) {
          return console.error("Error executing query", err.stack);
        }
        console.log(result.rows);
      }
    );
  }
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//////////////////////////////////////////////////////////////////////////////////////////------- USERS

app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.get("/users/:id", (req, res) => {
  pool
    .query("SELECT * FROM users WHERE id=$1", [req.params.id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.post("/users", (req, res) => {
  const { first_name, last_name, age } = req.body;
  pool
    .query(
      "INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.put("/users/:id", (req, res) => {
  const { first_name, last_name, age } = req.body;
  pool
    .query(
      "UPDATE users SET first_name=$2 last_name=$3 age=$4 WHERE id=$1 RETURNING *",
      [req.params.id, first_name, last_name, age]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.delete("/users/:id", (req, res) => {
  pool
    .query("DELETE * FROM users WHERE id=$1", [req.params.id])
    .then(() => res.sendStatus(204))
    .catch((e) => res.sendStatus(500));
});

//////////////////////////////////////////////////////////////////////////////////////////------- ORDERS

app.get("/orders", (req, res) => {
  pool
    .query("SELECT * FROM orders")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.get("/orders/:id", (req, res) => {
  pool
    .query("SELECT * FROM orders WHERE id=$1", [req.params.id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.post("/orders", (req, res) => {
  const { price, date, user_id } = req.body;
  pool
    .query(
      "INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3) RETURNING *",
      [price, date, user_id]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.put("/orders/:id", (req, res) => {
  const { price, date, user_id } = req.body;
  pool
    .query(
      "UPDATE orders SET price=$2 date=$3 user_id=$4 WHERE id=$1 RETURNING *",
      [req.params.id, price, date, user_id]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.delete("/orders/:id", (req, res) => {
  pool
    .query("DELETE * FROM orders WHERE id=$1", [req.params.id])
    .then(() => res.sendStatus(204))
    .catch((e) => {
      console.log("are we here?");
      res.send(e);
    });
});

app.listen(PORT, () =>
  console.log(`form server listening on http://localhost:${PORT}`)
);
