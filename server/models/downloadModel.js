const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Please provide your KEY'],
  },
  allUids: String,
  singleMale: String,
  singleFemale: String,
  marriedMale: String,
  marriedFemale: String,
  createdAt: {
    type: Date,
  },
});

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
