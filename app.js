require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = process.env.MONGOURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
