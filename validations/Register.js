const validString = require("./ValidString");
const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = [];

  data.email = validString(data.email) ? data.email : "";
  data.password = validString(data.password) ? data.password : "";
  data.password2 = validString(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.password, { min: 6, max: undefined })) {
    errors.push("Password must be at least 6 characters long");
  }

  if (Validator.isEmpty(data.password)) {
    errors.push("Password field is required");
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.push("The passwords you have entered do not match");
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
