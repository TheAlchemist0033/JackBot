const discord = require('discord.js');
const Bump = require('../../maindb/ubump.js'); // assuming the Bump model is in a file called bumpModel.js in the same directory as this file

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
        const leaderboardEmbed = new discord.MessageEmbed()
          .setTitle('Leaderboard')
          .setColor('#0099ff');
        bumps.forEach((bump, index) => {
          leaderboardEmbed.addField(`${index + 1}. ${bump.userID}`, `Counts: ${bump.counts}`);
        });
        message.channel.send(leaderboardEmbed);
      })
      .catch((err) => {
        console.error(err);
        message.channel.send('An error occurred while trying to fetch the leaderboard');
      });
  },
};
