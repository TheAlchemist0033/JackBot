const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  name: 'rob',
  description: 'Try to rob another user.',
  usage: '+rob @user',
  async execute(client, message, args) {
    // Set up a Mongoose model for the user balances
    const Balance = require('../../maindb/bal.js');

    // Check if the user has mentioned another user to rob
    if (!message.mentions.users.size) {
      return message.reply('You need to mention a user to rob them!');
    }

    // Get the user to rob
    const userToRob = message.mentions.users.first();

    // Check if the user trying to rob is the same as the user being robbed
    if (userToRob.id === message.author.id) {
      return message.channel.send("You can't rob yourself!");
    }

    // Find the user's balance in the database
    Balance.findOne({ userID: message.author.id }, async (err, res) => {
      if (err) return console.log(err);

      // If the user doesn't have a balance, create one with a starting balance of 0
      if (!res) {
        ball = new Balance({
          userID: message.author.id,
          username: `${message.author.username}#${message.author.discriminator}`,
          balance: 0,
        });
        await ball.save().catch((err) => console.log(err));
      }

      // Find the user to rob's balance in the database
      Balance.findOne({ userID: userToRob.id }, async (err, res) => {
        if (err) return console.log(err);

        // If the user being robbed doesn't have a balance, create one with a starting balance of 0
        if (!res) {
          ball = new Balance({
            userID: userToRob.id,
            username: `${userToRob.username}#${userToRob.discriminator}`,
            balance: 0,
          });
          await ball.save().catch((err) => console.log(err));
        }

        // Generate a random number between 0 and the user being robbed's balance
        const amount = Math.floor(Math.random() * res.balance);

        // Update the balances of both users
        await Balance.findOneAndUpdate(
          { userID: message.author.id },
          { $inc: { balance: amount } }
        );
        await Balance.findOneAndUpdate(
          { userID: userToRob.id },
          { $inc: { balance: -amount } }
        );

        // Send a message to the channel
        message.channel.send(
          `${message.author.username} robbed ${amount} Zhmorgles (ZML) from ${userToRob.username}!`); 
        });
    });
  },
};