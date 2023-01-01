const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    exists:Number,
    items:{type:mongoose.Schema.Types.Mixed}
  });
  const items = mongoose.model('items', itemSchema);
  module.exports = items