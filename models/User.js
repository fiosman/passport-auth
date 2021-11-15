const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordDigest: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.passwordDigest, salt, function (err, hash) {
      if (err) return next(err);
      user.passwordDigest = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, passwordMatched) {
  bcrypt.compare(candidatePassword, this.passwordDigest, function (err, isMatch) {
    if (err) return passwordMatched(err, null);
    passwordMatched(null, isMatch);
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
