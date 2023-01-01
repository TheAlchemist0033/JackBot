const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands or information about a specific command.',
    usage: '+help [command name]',
    async execute(client, message, args) {
        if (!args.length) {
            // Display a list of available commands organized by folder
            const categories = new Map();
            client.commands.forEach(cmd => {
                const folder = cmd.folder;
                if (!categories.has(folder)) categories.set(folder, []);
                categories.get(folder).push(cmd);
            });

            const embed =  new EmbedBuilder()
                .setTitle('Commands List')
                .setColor('#0099ff');

            categories.forEach((commands, category) => {
                const cmdList = commands.map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
                embed.addFields({name:category, value:cmdList});
            });
            return message.channel.send({embeds:[embed]});
        } else {
            // Display information about a specific command
            const name = args[0];
            const cmd = client.commands.get(name);
            if (!cmd) return message.channel.send(`Command **${name}** not found.`);
            const embed =  new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Command: ${cmd.name}`)
                .addFields({name:'Description:',value: cmd.description},{name:'Usage:', value:cmd.usage})
            return message.channel.send({embeds:[embed]});
        }
    },
};
