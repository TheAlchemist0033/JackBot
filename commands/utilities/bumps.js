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
                  const embed =  new EmbedBuilder()
                  .setTitle('User Bumps')
                  .addFields(
                    {name:"ServerID",value:message.guildID},
                    {name:"userID",value:message.author.id},
                    {name:"Bumps: ",value:"0"})
                  .setColor('#0099ff');
                  message.channel.send({embeds:[embed]})
            }else{
                const embed =  new EmbedBuilder()
                .setTitle('User Bumps')
                .addFields(
                  {name:"ServerID",value:res.ServerID},
                  {name:"userID",value:res.userID},
                  {name:"Bumps: ",value:res.counts.toString()})
                .setColor('#0099ff');
                res.save().catch(err=>console.log(err));
            }
        })
    },
};
