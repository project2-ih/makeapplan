const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
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
  accessibility: Number,
  participants: Number,
  price: Number,
  comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  invitees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  confirmed: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
