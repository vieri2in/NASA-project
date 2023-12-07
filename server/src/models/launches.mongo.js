const mongoose = require("mongoose");
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    default: 100,
    min: 100,
    max: 999,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  customers: [String],
  target: {
    type: String,
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});
module.exports = mongoose.model("Launch", launchesSchema);
