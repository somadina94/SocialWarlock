const mongoose = require("mongoose");

const uidsCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  counter: Number,
});

const UidsCounter = mongoose.model("UidsCounter", uidsCounterSchema);

module.exports = UidsCounter;
