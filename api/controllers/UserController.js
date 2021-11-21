const User = require("../../models/User");
const validateRegisterInput = require("../../validations/Register");
const validateLoginInput = require("../../validations/Login");
const validatePasswordInput = require("../../validations/ChangePassword");
const jwtUtil = require("../../services/Jwt");
const bcrypt = require("bcryptjs");

const requestPasswordReset = require("../../services/PasswordReset").requestPasswordReset;
const resetPassword = require("../../services/PasswordReset").resetPassword;

const createUser = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ email: "A user with that email already exists." });
    }
    const newUser = new User({
      email: req.body.email,
      passwordDigest: req.body.password,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.passwordDigest = await bcrypt.hash(newUser.passwordDigest, salt);
    const savedUser = await newUser.save();
    if (savedUser) {
      return res.json({
        userId: user._id,
        email: user.email,
      });
    }
  } catch (error) {
    return res.json({ error: error });
  }
};

const loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      errors.push("This user does not exist");
      return res.status(401).json(errors);
    } else {
      bcrypt.compare(req.body.password, user.passwordDigest, function (err, isMatch) {
        if (err) {
          errors.push(err);
          return res.status(401).json(errors);
        }
        if (isMatch) {
          const jwt = jwtUtil.createToken(user._id);
          return res.json({
            userId: user._id,
            email: user.email,
            token: jwt.token,
          });
        } else {
          errors.push("Invalid credentials");
          return res.status(401).json(errors);
        }
      });
    }
  });
};

const getUserProfile = (req, res) => {
  const currentToken = req.headers.authorization;
  const refreshedToken = jwtUtil.refreshToken(req.headers.authorization);
  // if (refreshedToken != undefined) {
  //   console.log(refreshedToken);
  // }
  return res.json({
    message: "This is the user profile",
    token: refreshedToken != undefined ? refreshedToken.token : currentToken,
  });
};

const changeUserPassword = async (req, res) => {
  const { errors, isValid } = validatePasswordInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors: errors });
  }
  const { currentPassword, password1 } = req.body;

  const userId = req.user._id;

  User.findOne({ _id: userId }).then((user) => {
    bcrypt.compare(currentPassword, user.passwordDigest, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password1, salt, (err, hash) => {
            if (err) throw err;
            user.passwordDigest = hash;
            user.save();
          });
        });
        return res.json({ message: "Password changed successfully" });
      } else {
        return res.status(400).json({ message: "Incorrect password entered" });
      }
    });
  });
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(req.body.email);
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  //need to implement password validation here
  // const { errors, isValid } = validatePasswordInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json({ errors: errors });
  // }
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  changeUserPassword,
  resetPasswordRequestController,
  resetPasswordController,
};
