const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands or information about a specific command.',
    usage: '+help [command name]',
    async execute(client, message, args) {
        if (!args.length) {
            // Display a list of available commands
            const commands = client.commands.map(cmd => ({name:`**${cmd.name}**`, value:`${cmd.description}`}));
            console.log(commands)
            const embed =  new EmbedBuilder()
                .setTitle('Commands List')
                .setColor('#0099ff');

            commands.forEach(element => {
                embed.addFields(element);
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
