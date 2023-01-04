const mongoose = require('mongoose');
const bumpSchema = new mongoose.Schema({
    serverID: {
      type: String,
      required: true
    },
    bumpTime: {
      type: Number,
      required: true
    },
    notifyCooldown:{
      type: Number,
      required: true
    }
  });
const Bump = mongoose.model('Bump', bumpSchema);
module.exports = Bump;


