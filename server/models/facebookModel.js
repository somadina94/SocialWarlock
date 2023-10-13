const mongoose = require('mongoose');

const facebookSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  appState: Object,
  messages: [String],
  messagesCounter: Number,
  usernames: [{ uid: String, full_name: String }],
  usernamesCounter: Number,
  status: {
    type: Boolean,
    default: true,
  },
});

const Facebook = mongoose.model('Facebook', facebookSchema);

module.exports = Facebook;
