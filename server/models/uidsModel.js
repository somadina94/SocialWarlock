const mongoose = require("mongoose");

const uidsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  uids: [{ username: String, full_name: String }],
});

const Uids = mongoose.model("Uids", uidsSchema);

module.exports = Uids;
