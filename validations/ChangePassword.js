const validString = require("./ValidString");
const Validator = require("validator");

module.exports = function validatePasswordInput(data) {
  let errors = [];

  data.currentPassword = validString(data.currentPassword) ? data.currentPassword : "";
  data.password1 = validString(data.password1) ? data.password1 : "";
  data.password2 = validString(data.password2) ? data.password2 : "";

  if (
    Validator.isEmpty(data.currentPassword) ||
    Validator.isEmpty(data.password1) ||
    Validator.isEmpty(data.password2)
  ) {
    errors.push("Password field is required");
  }

  if (
    !Validator.isLength(data.password1, { min: 8, max: undefined }) ||
    !Validator.isLength(data.password2, { min: 8, max: undefined })
  ) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!Validator.equals(data.password1, data.password2)) {
    errors.push("The passwords you have entered do not match");
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
