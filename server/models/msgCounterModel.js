const mongoose = require("mongoose");

const msgCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  counter: Number,
});

const MessagesCounter = mongoose.model("MessagesCounter", msgCounterSchema);

module.exports = MessagesCounter;
