const mongoose = require('mongoose');
const balanceSchema = new mongoose.Schema({
    userId: String,
    balance: Number,
    inventory:{type:mongoose.Schema.Types.Mixed},
  });
  const Balance = mongoose.model('Balance', balanceSchema);
  module.exports = Balance