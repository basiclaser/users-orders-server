import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";

import express from "express";
import pkg from "pg";
import morgan from "morgan";
import cors from "cors";
const PORT = process.env.PORT || 8000;
const app = express();

//CROSS ORIGIN RESOURCE SHARING
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//////////////////////////////////////////////////////////////////////////////////////////------- USERS

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl, new Date());
  const err = new Error("this api doesnt work on fridays");
  next(err);
});

var accessLogStream = fs.createWriteStream(
  path.join(process.cwd(), "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/users", (req, res) => {
  res.send("welcome to users");
});

app.use((error, req, res, next) => {
  res.send(error.message);
});

app.listen(PORT, () =>
  console.log(`form server listening on http://localhost:${PORT}`)
);
