const Discord = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Ping the bot to see if it is online and display the API response time',
  usage:'+ping',
  execute(client, message, args) {
    const startTime = Date.now();
    message.channel.send('Pong! Calculating API response time...').then(sentMessage => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      sentMessage.edit(`Pong! API response time: ${responseTime}ms\nThis entire command was written using AI.`);
    });
  },
};