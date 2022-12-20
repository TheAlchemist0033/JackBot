const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a specified user from the server.',
    usage: '+ban @user [reason]',
    async execute(client, message, args) {
        // Check if the user has the necessary permissions to ban users
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send(new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You don't have permission to ban users!"));
        }

        // Check if a user mention was provided
        if (!message.mentions.users.size) {
            return message.channel.send(new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You need to specify a user to ban!"));
        }

        // Get the mentioned user
        const bannedUser = message.mentions.users.first();

        // Check if the user can be banned (e.g. they are not an admin or have a higher role than the user issuing the command)
        if (!bannedUser || !bannedUser.bannable) {
            const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("That user cannot be banned!");
            return message.channel.send({embeds:[embed]});
        }

        // Ban the user
        try {
            await bannedUser.ban();
            new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${bannedUser.tag} was banned by ${message.author.tag}!`);
            return message.channel.send({embeds:[embed]});
        } catch (error) {
            console.error(error);
            new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("An error occurred while trying to ban the user!");
            return message.channel.send({embeds:[embed]});
        }
    },
};
