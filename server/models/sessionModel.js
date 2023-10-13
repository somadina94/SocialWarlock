const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Provide username'],
  },
  cookies: {
    type: Object,
    required: [true, 'Provide cookies'],
  },
  deviceState: {
    deviceString: String,
    userAgent: String,
    deviceGuid: String,
    phoneGuid: String,
    uuid: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
