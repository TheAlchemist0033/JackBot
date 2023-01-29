const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'debug',
    description: 'For debugging use.',
    usage: '+debug [data]',
    async execute(client, message, args) {
      var counter = 10;
      var cmess = counter.toString();
      mss = await message.channel.send(cmess);
      function recurse(){
        if(counter > 0){
        setTimeout(async()=>{
          counter -= 1 
          cmess = counter.toString()
          mss = await mss.edit(cmess);
          recurse();
        },1000)
       
      }

      }
      recurse()
    },
};