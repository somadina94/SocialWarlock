const mongoose = require('mongoose');

const mUserSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },
  subDate: Date,
  expDate: Date,
  credit: Number,
});

const MUser = mongoose.model('MUser', mUserSchema);

module.exports = MUser;
