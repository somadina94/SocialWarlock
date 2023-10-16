const mongoose = require('mongoose');

const oldSchema = new mongoose.Schema({
  key: String,
  oldUids: [],
});

const Old = mongoose.model('Old', oldSchema);

module.exports = Old;
