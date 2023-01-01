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
            if(!(res.fishcool > new Date().getTime()) ){
                return message.channel.send("You need to wait 3 minutes between teleportation attempts.")
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
      const fish = {
        trout: {
          name: 'ZingleDorp',
          value: 10,
        },
        salmon: {
          name: 'Morthelrop',
          value: 20,
        },
        bass: {
          name: 'Beezingozar',
          value: 30,
        },
        catfish: {
          name: 'KloomKlom',
          value: 40,
        },
      };

      // Catch a fish if the random number is greater than 0.7
      if (chance > 0.7) {
        // Generate a random index for the fish object
        const keys = Object.keys(fish);
        const index = Math.floor(Math.random() * keys.length);

        // Get the fish at the random index
        const caughtFish = keys[index];

        // Add the fish to the user's inventory
        await Balance.findOneAndUpdate(
          { userID: message.author.id },
          {
            $set: {
              [`items.${caughtFish}`]: fish[caughtFish],
            },$set:{fishcool:new Date().getTime()+180000}
          }
        );

        // Send a message to the channel
        message.channel.send(
          `You caught a ${fish[caughtFish].name} worth ${
            fish[caughtFish].value
          } Zhmorgles (ZML)!`
        );
      } else {
        // Send a message to the channel if the user didn't catch a fish
        await Balance.findOneAndUpdate(
            { userID: message.author.id },
            {
              $set: {
                fishcool:new Date().getTime() + 18000,
              }
            }
          );
        message.channel.send("You didn't catch any fish this time. Better luck next time!");
        
      }
    }
                
    });
  },
};
