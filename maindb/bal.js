const mongoose = require('mongoose');
const balanceSchema = new mongoose.Schema({
    userID: String,
    serverID:String,
    balance: Number,
    username:String,
    inventory:{type:mongoose.Schema.Types.Mixed},
    cooldown:Number,
    fishcool:Number,
    workcooldown:Number,
    robcool:Number
  });
  const Balance = mongoose.model('Balance', balanceSchema);
  module.exports = Balance