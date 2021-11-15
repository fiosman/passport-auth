require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = process.env.MONGOURI;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const users = require("./api/routes/Users");

const port = process.env.PORT || 5000;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => app.listen(port))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const authHeader = req.cookies.jwt;
  if (authHeader) {
    req.headers.authorization = `Bearer ${authHeader}`;
  }
  next();
});

app.use(passport.initialize());

app.use("/api/users", users);
