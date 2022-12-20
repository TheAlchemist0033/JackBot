const {
    EmbedBuilder
} = require('discord.js'); // Require the Discord.js library
const pastebin = require('pastebin-ts'); // Require the pastebin-js library
const Twit = require('twit');
const mongoose = require("mongoose");

// Define the Tweet schema
const Tweet = require('./db/tweetschema.js');

// Create the Tweet model
//const Tweet = mongoose.model('Tweet', tweetSchema);

// Define the Cve schema
const Cve = require('./db/cveschema.js');
// Create the Cve model
//const Cve = mongoose.model('Cve', cveSchema);

module.exports = {
    name: 'tweetsearch',
    description: 'Searches for tweets containing specified words',
    usage: '+tweetsearch query1 query2 query3',
    execute(client, message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide one or more words to search for.');
        }
        // Twitter API credentials
        const T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });

        // Generate search query array
        const searchQuery = args.map((arg) => `${arg}`); // Search for tweets containing "cve-<CVE number>"

        // Search parameters
        console.log(searchQuery)
        const params = {
            q: searchQuery.join(' OR '), // Join the search query array with " OR " to search for tweets containing any of the specified CVE numbers
            count: 200,
            result_type: 'mixed',
            //  lang: 'en',
        };

        // Search for tweets
        T.get('search/tweets', params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const tweets = data.statuses;
                // Filter tweets to only include those that follow the standard CVE format
                const cveTweets = tweets.filter((tweet) => {
                    // Standard CVE format: "CVE-YYYY-NNNNN"
                    const cveRegex = /cve-(\d{4})-(\d{5})/i;
                    return cveRegex.test(tweet.text);
                });
                // Make a list of the ID of each tweet and the mentioned CVEs
                const tweetList = cveTweets.map((tweet) => {
                    // Extract the mentioned CVEs from the tweet text
                    const cves = tweet.text.match(/cve-(\d{4})-(\d{4,})/ig);
                    return {
                        id: tweet.id_str,
                        cves: cves,
                    };
                });
                // Create an object to store the counts of each CVE
                const cveCounts = {};

                // Iterate over the tweets and update the counts
                console.log(cveTweets + ":cves" + "::::" + tweets + " list")
                // tweets.forEach((tweet) => console.log(tweet))
                tweetList.forEach((tweet) => {
                    tweet.cves.forEach((cve) => {
                        if (cve in cveCounts) {
                            cveCounts[cve]++;
                        } else {
                            cveCounts[cve] = 1;
                        }
                    });
                    console.log(tweet)
                    // Check if the tweet already exists in the database
                    Tweet.findOne({
                        tweetId: tweet.id
                    }, (error, tweetDoc) => {
                        if (error) {
                            console.log(error);
                        } else if (!tweetDoc) {
                            // Save the tweet to the database if it doesn't already exist
                            const newTweet = new Tweet({
                                tweetId: tweet.id,
                                cves: tweet.cves,
                                cveCounts: tweet.cveCounts
                            });
                            newTweet.save((error) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(`Tweet ${tweet.id} saved to database.`);
                                }
                            });
                            // Update the count of each mentioned CVE only if the tweet is not already in the database
                            tweet.cves.forEach((cve) => {
                                Cve.updateOne({
                                    id: cve.toLowerCase()
                                }, {
                                    $inc: {
                                        count: 1
                                    },
                                    $set: {
                                        lastUpdated: new Date()
                                    }
                                }, {
                                    upsert: true
                                }, (error, cveDoc) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(`Successfully updated or inserted document for ${cve}`);
                                    }
                                });
                            });
                        }
                    });
                });
                // Create a message with the list of all the CVEs that were mentioned
                let messageContent = 'The following CVEs were mentioned:\ncve:  mentions\n';
                let deflength = messageContent.length
                for (const cve in cveCounts) {
                    messageContent += `${cve}:  ${cveCounts[cve]}\n`;
                }

                // Check if the message is greater than 1000 characters
                const PastebinAPI = require('pastebin-ts');

                const pastebin = new PastebinAPI({
                    'api_dev_key': process.env.PASTEBIN_ACCESS_TOKEN,
                    'api_user_name': 'TheAlchemist0033',
                    'api_user_password': process.env.PASTEBIN_PASSWORD
                });

                if (messageContent.length > deflength) {
                    // console.log(messageContent.length)
                    if (messageContent.length > 1000) {
                        // Upload the message to pastebin if it is too long

                        pastebin
                            .createPaste({
                                text: messageContent,
                                title: 'List of Mentioned CVEs',
                                format: null,
                                privacy: 1, // 0 = public, 1 = unlisted, 2 = private
                                expiration: 'N', // Expire the paste in 10 minutes
                            })
                            .then((pasteUrl) => {
                                // Send a Discord embed with a link to the paste
                                const embed = new EmbedBuilder()
                                    .setTitle('List of Mentioned CVEs')
                                    .setURL(pasteUrl)
                                    .setDescription(
                                        'The message was too long to be displayed in Discord, so it was uploaded to pastebin instead.',
                                    )
                                    .setColor(0x0099ff);
                                message.channel.send({
                                    embeds: [embed],
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        // Send the message as a Discord embed if it is not too long
                        const embed = new EmbedBuilder()
                            .setTitle('List of Mentioned CVEs')
                            .setDescription(messageContent)
                            .setColor(0x0099ff);
                        message.channel.send({
                            embeds: [embed],
                        });
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('List of Mentioned CVEs')
                        .setDescription('No tweets with those parameters were found in the last week.')
                        .setColor(0x0099ff);
                    message.channel.send({
                        embeds: [embed],
                    });
                }

            }
        });

    },
};
