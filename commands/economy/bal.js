const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: 'bal',
    description: 'View your balance.',
    usage: '+bal',
    async execute(client, message, args) {
        // Set up a Mongoose model for the user balances
        const Balance = require('../../maindb/bal.js');

        // Find the user's balance in the database
        const balance = await Balance.findOne({
            userID: message.author.id,
            serverID: message.guildId
        }, async (err, res) => {
            if (err) return console.log(err);


            // If the user doesn't have a balance, create one with a starting balance of 100
            if (!res) {
                ball = new Balance({
                    userId: message.author.id,
                    balance: 100
                });
                await ball.save().catch(err=> console.log(err));
            } else {

                // Send a message with the user's balance
                message.channel.send(`Your balance is ${res.balance} ZML.`);
            }
        })
    },
};