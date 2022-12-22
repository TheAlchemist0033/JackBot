const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js'); // Require the Discord.js library
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mutes a user for a given time period.',
  usage:'+mute @user `[#{w,h,m,s}]` `[reason]`  (e.g. `1h` for 1 hour).',
  execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("You don't have permission to mute users!");
        return message.channel.send({embeds:[embed]})
    }

    const userToMute = message.mentions.members.first();
    if (!userToMute) return message.reply('You must mention a user to mute them. Run +help mute to learn more about the command.');

    const muteDuration = args[1];
    if (!muteDuration) return message.reply('You must specify a duration for the mute.');
    
    const muteReason = args.slice(args.length - 2, args.length).join(" ");
    if (!muteReason) return message.reply('You must specify a reason for the mute.')

    // Convert duration to milliseconds
    const durationInMs = convertDurationToMs(muteDuration);



    // Implement mute logic here
    userToMute.timeout(durationInMs, 'They deserved it')
        .then(console.log)
        .catch(console.error);
        // Create an embed object
    const embed = new EmbedBuilder()
        .setTitle(`${userToMute.user.username} has been muted`)
        .setDescription(`Duration: ${muteDuration}\nReason: ${muteReason}`)
        .setImage('https://media.tenor.com/AWTHpRDIjboAAAAM/you-are-muted-jeremy-clarkson.gif');
  
      // Send the embed
    message.channel.send({embeds:[embed]});
  },
};

function convertDurationToMs(duration) {
  const regex = /^(\d+)([wdhms])$/;
  const match = regex.exec(duration);
  if (!match) throw new Error('Invalid duration format');

  const [, quantity, unit] = match;
  const quantityInMs = Number(quantity);

  switch (unit) {
    case 'w':
      return quantityInMs * 7 * 24 * 60 * 60 * 1000;
    case 'd':
      return quantityInMs * 24 * 60 * 60 * 1000;
    case 'h':
      return quantityInMs * 60 * 60 * 1000;
    case 'm':
      return quantityInMs * 60 * 1000;
    case 's':
      return quantityInMs * 1000;
  }
}
