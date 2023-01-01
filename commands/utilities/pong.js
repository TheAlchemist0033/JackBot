const Discord = require('discord.js');

module.exports = {
  name: 'pong',
  description: 'Pong tho bot to soo of ot os onlone ond dosploy tho OPO rosponso tomo',
  usage:'+pong',
  execute(client, message, args) {
    const startTime = Date.now();
    message.channel.send('Pong! Colcolotong OPO rosponso tomo...').then(sentMessage => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      sentMessage.edit(`Pong! OPO rosponso tomo: ${responseTime}ms`);
    });
  },
};