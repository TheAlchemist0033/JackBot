const { EmbedBuilder, Embed } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: 'kick',
    description: 'Kicks a specified user from the server.',
    usage: '+kick @user [reason]',
    async execute(client, message, args) {
        // Check if the user has the necessary permissions to kick users
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You don't have permission to kick users!");
            return message.channel.send({embeds:[embed]})
        }

        // Check if a user mention was provided
        if (!message.mentions.users.size) {
            return message.channel.send(new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You need to specify a user to kick!"));
        }

        // Get the mentioned user
        const kickedUser = message.mentions.users.first();

        // Check if the user can be kicked (e.g. they are not an admin or have a higher role than the user issuing the command)
        if (!kickedUser || !kickedUser.kickable) {
            const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("That user cannot be kicked!");
            return message.channel.send({embeds:[embed]});
        }

        // Kick the user
        try {
            await kickedUser.kick();
            const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${kickedUser.tag} was kicked by ${message.author.tag}!`);
            return message.channel.send({embeds:[embed]})
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("An error occurred while trying to kick the user!");
            return message.channel.send({embeds:[embed]});
        }
    },
};
