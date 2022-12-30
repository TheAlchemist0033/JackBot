const {
    EmbedBuilder
} = require('discord.js');
const request = require('request');
const Buffer = require('buffer').Buffer;

module.exports = {
    name: 'plantid',
    description: 'Identifies a plant in an image using the Plant.id API.',
    usage: '+plantid [image file]',
    async execute(client, message, args) {
        try {
            // encode image to base64
            if (!(message.attachments.size > 0)) {
                return message.channel.send("You need to upload an image.");
            }
            message.channel.send("```Please do not abuse this command, it is NOT free. It costs about 5 cents per image search... which isnt a lot but still...```");
            const tempmessage = await message.channel.send("Generating Response...");
            const imageFile = message.attachments.first().attachment;
            const imageData = await new Promise((resolve, reject) => {
                request.get({
                    url: imageFile,
                    encoding: null
                }, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        const imageBuffer = Buffer.from(body, 'binary');
                        const imageBase64 = imageBuffer.toString('base64');
                        resolve(imageBase64);
                    }
                });
            });

            const options = {
                url: 'https://api.plant.id/v2/identify',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': process.env.PLANT_API_TOKEN,
                },
                json: {
                    images: [imageData],
                    modifiers: ['similar_images'],
                    plant_details: ['common_names', 'url'],
                },
            };

            request.post(options, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(body)
                    body.suggestions.forEach(async (suggestion, index) => {
                        const image = await getWikipediaImage(suggestion.plant_details.url);
                        if(image) {
                            const imageUrl = "https:" + image.toString();
                        }
                        const embed = new EmbedBuilder()
                            .setTitle(`${suggestion.plant_name}`)
                            .setDescription(`Common Names: ${suggestion.plant_details.common_names}\nUrl: ${suggestion.plant_details.url}\nProbability: ${suggestion.probability*100}%`)
                            if(image){
                                embed.setImage(imageUrl)
                            }

                        if (index === 0) {
                            // Edit the tempmessage for the first suggestion
                            tempmessage.edit({
                                embeds: [embed]
                            });
                        } else {
                            if (index <= 5) {
                                // Send a new message for all the other suggestions
                                tempmessage.channel.send({
                                    embeds: [embed]
                                });
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
};
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
