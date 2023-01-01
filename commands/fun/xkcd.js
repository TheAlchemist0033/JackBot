const request = require('request');
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'xkcd',
  description: 'Displays a random xkcd comic',
  usage: '!xkcd',
  execute(client, message, args) {
    request('https://xkcd.com/info.0.json', (error, response, body) => {
      if (error) {
        console.error(error);
        return message.channel.send('An error occurred while trying to fetch the comic');
      }
      if (response.statusCode !== 200) {
        console.error(`Invalid status code: ${response.statusCode}`);
        return message.channel.send('An error occurred while trying to fetch the comic');
      }
      const data = JSON.parse(body);
      const maxComicNumber = data.num;
      const randomComicNumber = Math.floor(Math.random() * maxComicNumber) + 1;
      request(`https://xkcd.com/${randomComicNumber}/info.0.json`, (err, res, bdy) => {
        if (err) {
          console.error(err);
          return message.channel.send('An error occurred while trying to fetch the comic');
        }
        if (res.statusCode !== 200) {
          console.error(`Invalid status code: ${res.statusCode}`);
          return message.channel.send('An error occurred while trying to fetch the comic');
        }
        const comicData = JSON.parse(bdy);
        const comicEmbed = new EmbedBuilder()
          .setTitle(comicData.title)
          .setURL(comicData.img)
          .setImage(comicData.img)
          .setFooter({text:`xkcd ${comicData.num}`})
          .setTimestamp();
        message.channel.send({embeds:[comicEmbed]});
      });
    });
  },
};
