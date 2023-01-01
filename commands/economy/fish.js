const Discord = require('discord.js');
const { e } = require('mathjs');
const mongoose = require('mongoose');

module.exports = {
  name: 'fish',
  description: 'Go fishing and try to catch a fish.',
  usage: '+fish',
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
          serverID:message.guildId,
          username: `${message.author.username}#${message.author.discriminator}`,
          balance: 0,
          inventory: {},
        });
        await ball.save().catch((err) => console.log(err));
      }else{
        if(res.fishcool){
            console.log(res.fishcool - new Date().getTime())
            if((res.fishcool > new Date().getTime()) ){
                return message.channel.send(`You need to wait 3 minutes between teleportation attempts. Time remaining: ${(res.fishcool - new Date().getTime()) /
                1000} seconds`);
            }
        }

      // Check if the user has a fishing pole in their inventory
      if(!res.inventory){
        Balance.updateOne({
            userID:message.author.id,
            serverID:message.guildId

        }, {
            $set: {
               inventory:{}
            }
        }, function(err, res) {
            if (err) return console.log(err);
            console.log("items updated");
        });
      }

      const hasFishingPole = 'microteleporter' in res.inventory || false;
      if (!hasFishingPole) {
        return message.channel.send(
          "You don't have a microteleporter! You can't teleport fish without one."
        );
      }

      // Generate a random number between 0 and 1
      const chance = Math.random();
                 // Set up an object of possible fish to catch
      const fish = [
        "zingledorp",
        "morthelrop",
        "beezingozar",
        "kloomkloom"
    ];

      // Catch a fish if the random number is greater than 0.7
      if (chance > 0.7) {
        // Generate a random index for the fish object
        const index = Math.floor(Math.random() * fish.length);

        // Get the fish at the random index
        const caughtFish = fish[index];

        // Add the fish to the user's inventory
        if(!res.inventory[caughtFish]){
            await Balance.findOneAndUpdate(
            { userID: message.author.id },
            {
                $set: {
                ['inventory.'+caughtFish]: 1
                },$set:{fishcool:new Date().getTime()+180000}
            }
            );

            // Send a message to the channel
            message.channel.send(
            `You caught a ${caughtFish}!`
            );
        }else{
            res.inventory[caughtFish] += 1;
            res.fishcool = new Date().getTime()+180000;
            res.save().catch(err => console.log(err));
            message.channel.send(`You caught another ${caughtFish}`)
        }
    } else {
        // Send a message to the channel if the user didn't catch a fish
        await Balance.findOneAndUpdate(
            { userID: message.author.id },
            {
              $set: {
                fishcool:new Date().getTime() + 180000,
              }
            }
          );
        message.channel.send("You didn't catch any fish this time. Better luck next time!");
        
      }
    }
                
    });
  },
};
