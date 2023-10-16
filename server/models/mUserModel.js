const mongoose = require('mongoose');

const mUserSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },
  String,
  all: String,
  credit: Number,
  createdAt: Date,
});

const MUser = mongoose.model('MUser', mUserSchema);

module.exports = MUser;
