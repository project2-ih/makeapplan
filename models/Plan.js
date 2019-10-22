const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },
    date: Date,
    activity: String,
    type: {
      type: String,
      enum: [
        "education",
        "recreational",
        "social",
        "diy",
        "charity",
        "cooking",
        "relaxation",
        "music",
        "busywork"
      ]
    },
    link: String,
    participants: Number,
    comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    invitees: [{ 
      type: Schema.Types.ObjectId, ref: "User",
    }],
    confirmationCode: {
      type: String,
      unique: true
    },
    confirmed: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
