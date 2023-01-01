const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  name: 'shopadd',
  description: 'Can only be used by the bot owner.',
  usage:'+shopadd',
  async execute(client,message,args) {
    // Set up a Mongoose model for the user balances
    if(message.author.id=="1058923942162726994"){
    // Find the user's balance in the database
    const shop = require('../../maindb/shop.js');
    shop.findOne({ shop:{exists:1 }},(err,res)=>{
        if(err){
            message.channel.send("There was an error pulling the data.");
            return console.log(err);
        }else if(!res){
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
            if(!args[0] || !args[1] || !args[2]){
                return message.channel.send("You must specify an item name, cost, and usage in that order.");
            }
            slice = args.slice(2);
            res.shop.stock[args[0]].cost = parseInt(args[1]);
            res.shop.stock[args[0]].usage = slice.join(" ");
            res.save().catch(err=>{console.log(err);})
            message.channel.send("No shop found, configuring new shop data.");
        }

    });
    
  }else{
    return message.channel.send("You are not authorized to do this.")
  }
}
};
