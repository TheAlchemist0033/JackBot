const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'debug',
    description: 'For debugging use.',
    usage: '+debug [data]',
    async execute(client, message, args) {
        const cheerio = require("cheerio");

        async function getWikipediaImage(url) {
          try {
            // Fetch the Wikipedia page
            const response = await fetch(url);
            const html = await response.text();
        
            // Load the HTML into cheerio
            const $ = cheerio.load(html);
        
            // Find the image element
            const image = $(".image img");
            const imageUrl = image.attr("src");
        
            return imageUrl;
          } catch (error) {
            console.error(error);
            return null;
          }
        }
        const imageUrl = await getWikipediaImage(args[0]);
        message.channel.send(`logging data: https:${imageUrl}`)
        console.log(imageUrl)
        
    },
};