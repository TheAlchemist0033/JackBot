const OpenAI = require('@openai/api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

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
            const response = await openai.images.generate({ prompt: query });

            const imageUrl = response.data.data.url;
            const embed = new EmbedBuilder()
            .setTitle(`Generated Image:`)
              .setImage(imageUrl)
              .setColor(0x0099ff);
            await message.channel.send({
              embeds: [embed]
            });
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while generating the image.');
        }
    },
};
