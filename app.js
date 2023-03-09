"use strict";
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//APIs
app.get("/", async (req, res) => {
  try {
    res.status(200).send("You are at home page.");
  } catch (err) {
    res.status(400).json(err.message);
  }
});
app.use("/bha/api", require("./routes/users.routes"));

//Error Handlings...
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  console.log(err.status, "comming from herr...");
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
