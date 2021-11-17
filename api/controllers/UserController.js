const User = require("../../models/User");
const validateRegisterInput = require("../../validations/Register");
const validateLoginInput = require("../../validations/Login");
const validatePasswordInput = require("../../validations/ChangePassword");
const jwtUtil = require("../../services/Jwt");
const bcrypt = require("bcryptjs");

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
      const jwt = jwtUtil.createToken(user);
      res.cookie("jwt", jwt.token, { httpOnly: true, maxAge: jwt.expires });
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
          const jwt = jwtUtil.createToken(user);
          res.cookie("jwt", jwt.token, { httpOnly: true, maxAge: jwt.expires });
          return res.json({
            userId: user._id,
            email: user.email,
          });
        } else {
          errors.push("Invalid credentials");
          return res.status(401).json(errors);
        }
      });
    }
  });
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: -1 });
  res.json({ message: "You have been logged out" });
};

const getUserProfile = (req, res) => {
  return res.json({ message: "This is the user profile" });
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

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  changeUserPassword,
};
