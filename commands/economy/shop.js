const Discord = require('discord.js');
const mongoose = require('mongoose');
const shop = require('../../maindb/shop.js');
const {EmbedBuilder} = require("discord.js");

module.exports = {
  name: 'shop',
  description: 'Lists all items.',
  usage:'+shop',
  async execute(client,message, args) {
    // Set up a Mongoose model for the user balances
    const Balance = require("../../maindb/bal.js");
    const Shop = require("../../maindb/shop.js");

    // Check if the user has specified an item to purchase
    
    //const item = args[0];

    // Check if the item is available for purchase
    shop.findOne({exists:1},async (err,res)=>{

        if(err){
            message.channel.send("I've encountered an error when searching for the shop inventory.");
            return console.log(err);
        }else if(!res){
            return message.channel.send("Shop has not been initialized by bot owner.");
        }else{
                /*  shop:{
                    exists:1,
                    stock:{
                        item1:{usage,cost},
                        item2:{usage,cost},
                        ...,
                        item3:{usage,cost}
                    }
                }*/
                const embed = new EmbedBuilder()
                .setTitle("Shop Inventory")
                console.log(res.stock);
            for(const key in res.stock){
               // console.log(key + " " + res.stock[key].cost + ": " + res.stock[key].usage);
                embed.addFields({name:`${key}: ${res.stock[key].cost} ZML`,value:res.stock[key].usage});
            }
          
            message.channel.send({embeds:[embed]});
    }
})
  }
};

   
