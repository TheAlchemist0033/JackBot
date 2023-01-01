const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: 'pay',
    description: 'Pay a user a specified amount.',
    usage: '+pay @user <amount>',
    async execute(client, message, args) {
        // Set up a Mongoose model for the user balances
        const Balance = require('../../maindb/bal.js');

        // Check if the user has mentioned another user to pay
        if (!message.mentions.users.size) {
            return message.reply('You need to mention a user to pay them!');
        }

        // Check if the user has provided an amount to pay
        if (!args[1]) {
            return message.reply('You need to provide an amount to pay!');
        }

        // Get the user to pay
        const userToPay = message.mentions.users.first();

        // Check if the user trying to pay is the same as the user being paid
        if (userToPay.id === message.author.id) {
            return message.channel.send("You can't pay yourself!");
        }

        // Find the user's balance in the database
        Balance.findOne({
            userID: message.author.id,
            serverID: message.guildId
        }, async (err, res) => {
            if (err) return console.log(err);

            // If the user doesn't have a balance, create one with a starting balance of 0
            if (!res) {
                ball = new Balance({
                    userID: message.author.id,
                    serverID: message.guildId,
                    balance: 100,
                    username: `${message.author.username}#${message.author.discriminator}`,
                    inventory: {},
                    cooldown: 0,
                    fishcool: 0,
                    workcooldown: 0,
                    robcool: 0
                });
                await ball.save().catch((err) => console.log(err));
                return message.channel.send("You don't have a balance to pay from!");
            }

            // Check if the user has enough money to pay the specified amount
            if (res.balance < args[1]) {
                return message.channel.send("You don't have enough money to pay that amount!");
            }

            // Find the user to pay's balance in the database
            Balance.findOne({
                userID: userToPay.id
            }, async (err, rres) => {
                if (err) return console.log(err);

                // If the user being paid doesn't have a balance, create one with a starting balance of 0
                if (!rres) {
                    ball = new Balance({
                        userID: userToPay.id,
                        serverID: message.guildId,
                        balance: 100,
                        username: `${userToPay.username}#${userToPay.discriminator}`,
                        inventory: {},
                        cooldown: 0,
                        fishcool: 0,
                        workcooldown: 0,
                        robcool: 0
                    });
                    await ball.save().catch((err) => console
                    .log(err));
                }

                // Update the balances of both users
                await Balance.findOneAndUpdate(
                    { userID: message.author.id },
                    { $inc: { balance: -args[1] } }
                );
                await Balance.findOneAndUpdate(
                    { userID: userToPay.id },
                    { $inc: { balance: args[1] } }
                );

                // Send a message with the updated balances
                message.channel.send(`${message.author.username} has paid ${userToPay.username} ${args[1]} Zhmorgles.`);
            });
        });
    }
};
