const validString = (str) => {
  if (typeof str === "string") {
    return str.trim().length > 0;
  } else {
    return false;
  }
};

module.exports = validString;
