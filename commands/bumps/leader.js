const discord = require('discord.js');
const Bump = require('../../maindb/ubump.js'); // assuming the Bump model is in a file called bumpModel.js in the same directory as this file
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'leader',
  description: 'Displays the top 10 users sorted by counts',
  usage: '!leader',
  execute(client, message, args) {
    Bump.find()
      .sort({ counts: -1 })
      .limit(10)
      .then((bumps) => {
        if (bumps.length === 0) {
          return message.channel.send('No bumps found');
        }

        const leaderboardEmbed = new EmbedBuilder()
          .setTitle('Leaderboard')
          .setColor('#0099ff');
        bumps.forEach(async (bump, index) => {
            let buser = await message.client.users.fetch(bump.userID);
            console.log(buser);
            leaderboardEmbed.addFields({name:`${index + 1}. ${buser.username}#${buser.discriminator}`,value:`Counts: ${bump.counts}`});
        });
        message.channel.send({embeds:[leaderboardEmbed]});
      })
      .catch((err) => {
        console.error(err);
        message.channel.send('An error occurred while trying to fetch the leaderboard');
      });
  },
};
