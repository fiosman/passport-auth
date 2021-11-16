const User = require("../../models/User");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");
const jwtUtil = require("../../services/Jwt");

const createUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "A user with that email already exists." });
    } else {
      const newUser = new User({
        email: req.body.email,
        passwordDigest: req.body.password,
      });
      newUser
        .save()
        .then((user) => {
          const jwt = jwtUtil.createToken(user);
          res.cookie("jwt", jwt.token, { httpOnly: true, maxAge: jwt.expires });
          return res.json({
            userId: user._id,
            email: user.email,
          });
        })
        .catch((err) => res.json(err));
    }
  });
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
      return res.status(404).json(errors);
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          errors.push(err);
          return res.status(404).json(errors);
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
          return res.status(404).json(errors);
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

const changeUserPassword = (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user._id;
  console.log(userId);
  return res.json({ message: "Wohoo bro" });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  changeUserPassword,
};
