const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  messages: [String],
});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
