const Discord = require('discord.js');
const mongoose = require('mongoose');
const {
    EmbedBuilder
} = require('discord.js');
module.exports = {
    name: 'shopadd',
    description: 'Can only be used by the bot owner.',
    usage: '+shopadd',
    async execute(client, message, args) {
        // Set up a Mongoose model for the user balances
        if (message.author.id == "608802993810440223") {
            // Find the user's balance in the database
            const shop = require('../../maindb/shop.js');
            shop.findOne({
                exists: 1
            }, (err, res) => {
                if (err) {
                    message.channel.send("There was an error pulling the data.");
                    return console.log(err);
                } else if (!res) {
                    /* const mongoose = require('mongoose');
                     const shopSchema = new mongoose.Schema({
                         shop:{
                             exists:1,
                             stock:{
                                 type:mongoose.Schema.Types.Mixed,
                                 },
                             }
                     });
                     const shop = mongoose.model('Shop', shopSchema);
                     module.exports = shop*/

                    /*
                    shop:{
                        exists:1,
                        stock:{
                            item1:{usage,cost},
                            item2:{usage,cost},
                            ...,
                            item3:{usage,cost}
                        }
                    }
                    */

                    TShop = new shop({
                        exists: 1
                    });
                    TShop.save().catch(err => console.log(err));
                    message.channel.send("Shop did not exist, run command again as shop has now been initialized.");

                } else {
                    if (!args[0] || !args[1] || !args[2]) {
                        return message.channel.send("You must specify an item name, cost, and usage in that order.");
                    }
                    shop.updateOne({
                        exists: 1
                    }, {
                        $set: {
                            ["stock." + args[0]]: {
                                cost: args[1],
                                usage: args.slice(2).join(" ")
                            }
                        }
                    }, function(err, res) {
                        if (err) return console.log(err);
                        message.channel.send("Shop updated");
                    });
                    const embed = new EmbedBuilder()
                        .setTitle("Shop Entry")
                        .addFields({
                            name: `${args[0]}: ${args[1]} ZML`,
                            value: args.slice(2).join(" ")
                        })
                    message.channel.send({
                        embeds: [embed]
                    });
                }
            });

        } else {
            return message.channel.send("You are not authorized to do this.")
        }
    }
};