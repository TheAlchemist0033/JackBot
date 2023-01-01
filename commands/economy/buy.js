const Discord = require('discord.js');
const mongoose = require('mongoose');
const shop = require('../../maindb/shop.js');

module.exports = {
  name: 'buy',
  description: 'Purchase an item.',
  usage:'+buy [item]',
  async execute(client,message, args) {
    // Set up a Mongoose model for the user balances
    const Balance = require("../../maindb/bal.js");
    const Shop = require("../../maindb/shop.js");

    // Check if the user has specified an item to purchase
    if (!args.length) {
      return message.channel.send(`You didn't specify an item to purchase!`);
    }
    const item = args[0];

    // Check if the item is available for purchase
    shop.findOne({exists:1},async (err,res)=>{

        if(err){
            message.channel.send("I've encountered an error when searching for the shop inventory.");
            return console.log(err);
        }else if(!res){
            return message.channel.send("Shop has not been initialized by bot owner.");
        }else{
            const availableItems = Object.keys(res.stock);
 
    //const availableItems = ['glipglop', 'smoglethorp', 'bleemerbloogle','glip','smog','blee'];
    if (!availableItems.includes(item)) {
      return message.channel.send(`${item} is not available for purchase.`);
    }

    // Check the cost of the item
    var cost = res.stock.item;
    // Find the user's balance in the database
    let balance = await Balance.findOne({ userID: message.author.id ,serverID:message.guildId});

    // If the user doesn't have a balance, create one with a starting balance of 100
    if (!balance) {
      balance = new Balance({
        userId: message.author.id,
        balance: 100
      });
      await balance.save();
    return message.channel.send("You did not have an account yet, please try running this command again. You currently have 100 Zhmorgles (ZML).");
    }

    // Check if the user has enough money to make the purchase
    if (balance.balance < cost) {
      return message.channel.send(`You don't have enough Zhmorgles to purchase ${item}!`);
    }

    // Subtract the cost of the item from the user's balance
    balance.balance -= cost;
    if(balance.inventory[item]){
        balance.inventory[item] += 1;
    }else{
        balance.inventory[item] = 1;
    }
    await balance.save();
    // Send a message confirming the purchase
    message.channel.send(`You have purchased ${item} for ${cost} Zhmorgles. Your balance is now ${balance.balance} ZML.`);


    }
})
  }
};

   
