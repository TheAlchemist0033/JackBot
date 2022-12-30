const mongoose = require('mongoose');
const bumpSchema = new mongoose.Schema({
    serverID: {
      type: String,
      required: true
    },
    userID:{
      type:String,
      required: true
    },
    counts:{
        type:Number,
        required: true
    }
  });
const Bump = mongoose.model('ubump', bumpSchema);
module.exports = Bump;