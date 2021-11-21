const jwt = require("jsonwebtoken");
const key = process.env.secretOrKey;
const jwt_decode = require("jwt-decode");
const mongoose = require("mongoose");

const createToken = (userId) => {
  const expiresIn = "30s";
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  // console.log(payload);

  const signedToken = jwt.sign(payload, key, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

const refreshToken = (token) => {
  const decodedToken = jwt_decode(token);
  const timeNow = Math.floor(Date.now() / 1000);
  const timeLeft = decodedToken.exp - timeNow;
  if (timeLeft < 5) {
    const newToken = createToken(mongoose.Types.ObjectId(decodedToken.sub));
    return newToken;
  }
};

module.exports = {
  createToken,
  refreshToken,
};
