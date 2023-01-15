const { Configuration, OpenAIApi } = require("openai");
const { EmbedBuilder } = require('discord.js');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: 'imgen',
    description: 'Generates an image given a query.',
    usage: '+imgen [Description of Image]',
    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send('Please provide a query for DALL-E to generate an image.');
        }

        const query = args.join(' ');

        try {
            // Use the DALL-E API to generate an image based on the query
            thismess = await message.channel.send("Generating image, please wait...")
            
            const response = await openai.createImage({
                prompt: query,
                n: 2,
                size: "1024x1024"
              });

              image_urls = response.data.data;

            //const imageUrl = response.data.data.url;
            console.log(response)
            const embed = new EmbedBuilder()
            .setTitle(`Generated Image:`)
              .setColor(0x0099ff);
            for(let i=0;i<response.data.data.length;i++){
                embed.addFields({name:`Image ${i}`,value:image_urls[i]})
            }
            thismess.edit({
              embeds: [embed]
            });
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while generating the image.');
        }
    },
};
