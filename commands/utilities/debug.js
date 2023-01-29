const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'debug',
    description: 'For debugging use.',
    usage: '+debug [data]',
    async execute(client, message, args) {
      var delM = await message.channel.send("10");
      var cDown = 10
      async function mss(){
        if(cDown > 0){
          setTimeout(async () => {
            cD = (cDown-1).toString() 
            delM = await delM.edit(cD)
            mss()
          },1000)
        }else{
          delM.delete()
        }
          
      }
      mss()

    },
};