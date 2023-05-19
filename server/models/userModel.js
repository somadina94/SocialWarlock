const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your fullname"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Please provide an email address"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: "Your password and confirm password are not the same",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("orders", {
  ref: "Order",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  userPassword,
  candidatePassword
) {
  return await bcrypt.compare(userPassword, candidatePassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 10;

  return resetToken;
};

userSchema.methods.changedPasswordAfterJWT = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
