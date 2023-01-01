const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  name: 'work',
  description: 'Work to earn some money.',
  usage: '+work',
  async execute(client, message, args) {
    // Set up a Mongoose model for the user balances
    const Balance = require('../../maindb/bal.js');

    // Find the user's balance in the database
    Balance.findOne({ userID: message.author.id }, async (err, res) => {
      if (err) return console.log(err);

      // If the user doesn't have a balance, create one with a starting balance of 0
      if (!res) {
        ball = new Balance({
          userID: message.author.id,
          username: `${message.author.username}#${message.author.discriminator}`,
          balance: 0,
          cooldown: new Date().getTime(),
        });
        await ball.save().catch((err) => console.log(err));
      }

      // Check if the user is on cooldown
      if ((res.cooldown > new Date().getTime())) {
        return message.channel.send(
          `You need to wait before working again. Time remaining: ${(res.cooldown - new Date().getTime()) /
            1000} seconds`
        );
      }

      // Generate a random amount of money between 10 and 100
      const amount = Math.floor(Math.random() * 91 + 10);

      // Update the user's balance and cooldown time
      await Balance.findOneAndUpdate(
        { userID: message.author.id },
        { $inc: { balance: amount }, $set: { workcooldown: new Date().getTime()+180000} }
      );

      // Send a message to the channel
      message.channel.send(
        `You worked and earned ${amount} Zhmorgles (ZML). You can work again in 3 minutes.`
      );
    });
  },
};
