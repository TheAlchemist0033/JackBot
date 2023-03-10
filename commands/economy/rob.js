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
        Balance.findOne({
            userID: message.author.id,
            serverID: message.guildId
        }, async (err, res) => {
            if (err) return console.log(err);
            // If the user doesn't have a balance, create one with a starting balance of 0
            if (!res) {
                ball = new Balance({
                    uuserID: userToRob.id,
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
            } else {
                if (res.robcool) {
                    if (res.robcool < new Date().getTime()) {

                        // Find the user to rob's balance in the database
                        Balance.findOne({
                            userID: userToRob.id
                        }, async (err, rres) => {
                            if (err) return console.log(err);

                            // If the user being robbed doesn't have a balance, create one with a starting balance of 0
                            if (!rres) {
                                ball = new Balance({
                                    /*  userID: String,
                                        serverID:String,
                                        balance: Number,
                                        username:String,
                                        inventory:{type:mongoose.Schema.Types.Mixed},
                                        cooldown:Number,
                                        fishcool:Number,
                                        workcooldown:Number,
                                        robcool:Number*/
                                    userID: userToRob.id,
                                    serverID: message.guildId,
                                    balance: 100,
                                    username: `${userToRob.username}#${userToRob.discriminator}`,
                                    inventory: {},
                                    cooldown: 0,
                                    fishcool: 0,
                                    workcooldown: 0,
                                    robcool: 0
                                });
                                await ball.save().catch((err) => console.log(err));
                                message.cannel.send("You couldn't rob that user! They do not have any money!")
                            } else {

                                // Generate a random number between 0 and the user being robbed's balance
                                if (rres.balance <= 50) {
                                    return message.channel.send("That person is too poor to rob.");
                                }
                                const amount = Math.floor(Math.random() * rres.balance);

                                // Update the balances of both users
                                await Balance.findOneAndUpdate({
                                    userID: message.author.id,
                                    serverID: message.guildId
                                }, {
                                    $inc: {
                                        balance: amount
                                    },
                                    $set: {
                                        robcool: new Date().getTime() + 30000
                                    }
                                });

                                await Balance.findOneAndUpdate({
                                    userID: userToRob.id
                                }, {
                                    $inc: {
                                        balance: -amount
                                    }
                                });

                                // Send a message to the channel
                                message.channel.send(
                                    `${message.author.username} robbed ${amount} Zhmorgles (ZML) from ${userToRob.username}!`);
                            }

                        });
                    }else {
                        message.channel.send("You need to wait at least 30 seconds before robbing another user!")
                    }
                }else{
                    await Balance.findOneAndUpdate({
                        userID: message.author.id,
                        serverID: message.guildId
                    }, {
                        $set: {
                            robcool:0
                        }
                    });
                    message.channel.send("Your profile was re-initialized. Please run the command again.")
                }
            }
        });
    },
};