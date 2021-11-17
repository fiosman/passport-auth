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

  if (!Validator.equals(data.password1, data.password2)) {
    errors.push("The passwords you have entered do not match");
  }

  if (!Validator.isStrongPassword(data.password1) || !Validator.isStrongPassword(data.password2)) {
    errors.push("Your password must meet the requirements below!"); //min length 8, minLowerCase 1, minUpperCase 1, minNumbers: 1, minSymbols: 1
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
