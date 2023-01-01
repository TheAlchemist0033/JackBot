const mongoose = require('mongoose');
const shopSchema = new mongoose.Schema({
    exists:Number,
    stock:{
        type:mongoose.Schema.Types.Mixed,
    },
  });
  const shop = mongoose.model('Shop', shopSchema);
  module.exports = shop