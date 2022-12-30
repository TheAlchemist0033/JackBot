const math = require('mathjs');
const uBump = require('../../maindb/ubump.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'bumps',
    description: 'Displays user bumps',
    execute(client, message, args) {
        // If no arguments are supplied, send a message to the channel
        uBump.findOne({
           serverID: message.guildId,
           userID:message.author.id
        }, (error, res) => {
            if (error) {
                console.log(error);
            } else if (!res) {
                const newBump = new uBump({
                    serverID: message.guildId,
                    userID:message.author.id,
                    counts:0
                  });
                  newBump.save().catch(err=> console.log(err));
                  const embed =  new EmbedBuilder()
                  .setTitle('User Bumps')
                  .addFields(
                    {name:"ServerID",value:message.guildId},
                    {name:"UserID",value:message.author.id},
                    {name:"User",value:message.author.username +"#"+ message.author.discriminator},
                    {name:"Bumps: ",value:"0"})
                  .setColor('#0099ff');
                  message.channel.send({embeds:[embed]})
            }else{
                console.log(res)
                message.channel.send("Logging data")
                const embed =  new EmbedBuilder()
                .setTitle('User Bumps')
                .addFields(
                  {name:"ServerID",value:res.serverID},
                  {name:"userID",value:res.userID},
                  {name:"User",value:`${message.author.username}#${message.author.discriminator}`},
                  {name:"Bumps: ",value:res.counts.toString()
                })
                .setColor('#0099ff');
                res.save().catch(err=>console.log(err));
                message.channel.send({embeds:[embed]});
            }

        })
    },
};
