const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    exists:1,
    items:{type:mongoose.Schema.Types.Mixed}
  });
  const items = mongoose.model('items', itemSchema);
  module.exports = items