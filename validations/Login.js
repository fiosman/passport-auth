const validString = require("./ValidString");
const Validator = require("validator");

module.exports = function validateLoginInput(data) {
  let errors = [];

  data.email = validString(data.email) ? data.email : "";
  data.password = validString(data.password) ? data.password : "";

  if (Validator.isEmpty(data.password)) {
    errors.push("Password field is required");
  }

  if (Validator.isEmpty(data.email)) {
    errors.push("Email field is required");
  }

  if (!Validator.isEmail(data.email)) {
    errors.push("Email must be valid");
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
