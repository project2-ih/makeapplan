const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    email: String,
    password: String,
    profilePhoto: {
      type: String,
      default: "https://bit.ly/2kY5pfr"
    },
    confirmationCode: {
      type: String,
      unique: true
    },
    status: {
      type: String,
      enum: ["Active", "Pending"],
      default: "Pending"
    },
    googleId: String,
    facebookId: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
