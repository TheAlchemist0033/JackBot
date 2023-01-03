require('dotenv').config({
    path: "./.env"
});
const Discord = require('discord.js');
const fs = require("fs");
const math = require("mathjs");
const {
    Client,
    GatewayIntentBits
} = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const mongoose = require("mongoose");
const url = process.env.MONURL //"mongodb://127.0.0.1:27017";
try {
    mongoose.connect(
        url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log("Mongoose has connected sucessfully.")
    );
} catch (e) {
    console.log("Encountered an error connecting.");
}
client.commands = new Discord.Collection();
let comList = [];
const config = require("./config.json");
const {
    createVerify
} = require('crypto');
const {
    re
} = require('mathjs');
fs.readdir("./commands/", (err, folders) => {
    if (err) throw err;
    for (let i = 0; i < folders.length; i++) {
        fs.readdir(`./commands/${folders[i]}`, (e, files) => {
            if (e) console.log(e)
            let jsfiles = files.filter(f => f.split(".").pop() === 'js');
            if (jsfiles.length < 1) {
                console.log(`No commands in ${folders[i]}`);
                return;
            }
            jsfiles.forEach((file) => {
                let properties = require(`./commands/${folders[i]}/${file}`);
                properties.folder = folders[i]; // <-- Add this line
                console.log(`Loaded ${file}`);
                comList.push(file);
                client.commands.set(properties.name, properties)
            })
        })
    }
});

//end declares
client.on("ready", () => {
    console.log(`${client.user.tag} is now active!`);
});
client.on("guildMemberAdd", async (member) => {
    console.log(`${member.user.tag} has joined`);
    await member.guild.roles.fetch() //optional - put it if the role is valid, but is not cached
    let role = member.guild.roles.cache.find(role => role.name === 'Member')
    member.roles.add(role)
});
client.on("messageCreate", async (message) => {
    function log(logmessage) {
        if (message.guild.channels.has(logChannel)) {
            message.guild.channels.get(logChannel).send({
                embed: logmessage
            }).then().catch(err => console.log(err));
        }
    }
    //this section in development
    /// Create a schema for the bump data


    // Create a model for the bump data
    const Bump = require('./maindb/bump.js');
    const uBump = require('./maindb/ubump.js');
    const Balance = require("./maindb/bal.js");
    //console.log(message)
    if (message.author.id === '302050872383242240') {
        // Check if the message content includes the string "Bump done!"
        console.log(message.embeds[0].data.description)
        if (message.embeds[0].data.description.includes('Bump done!')) {
            console.log("Successful bump detected!");
            var bumpmess = await message.channel.send("Bump was successful! type 'Claim' to claim the bump.");
            const filter = m => m.content.toLowerCase().includes('claim');
            const collector = message.channel.createMessageCollector({
                filter,
                time: 10000
            });
            /*Bump.findOneAndUpdate({serverID:message.guildId}, {
                $set: {
                    bumpTime:new Date().getTime() + 7200000
                }
            })*/
            var colc = 0
            collector.on('collect', async m => {
                colc += 1;
                if (colc <= 1) {
                    console.log(`Collected ${m.content}`);

                    uBump.findOne({
                        userID: m.author.id,
                        serverID: message.guildId
                    }, (error, res) => {
                        if (error) {
                            console.log(error);
                        } else if (!res) {
                            const newBump = new uBump({
                                serverID: m.guildId,
                                userID: m.author.id,
                                username: m.author.username + "#" + m.author.discriminator,
                                counts: 1
                            });
                            newBump.save().catch(err => console.log(err));
                            message.channel.send("Ive updated the bump count for " + `${m.author.username}#${m.author.discriminator} to 1! Congrats on your first bump.`);

                        } else {
                            res.counts += 1;
                            res.save().catch(err => console.log(err));
                            message.channel.send("Ive updated the bump count for " + `${m.author.username}#${m.author.discriminator} to ${res.counts}`);

                        }
                    })


                    Bump.findOne({
                        serverID: message.guildId
                    }, (error, res) => {
                        if (error) {
                            console.log(error);
                        } else if (!res) {
                            const newBump = new Bump({
                                serverID: message.guildId,
                                bumpTime: new Date().getTime() + 7200000,
                                notifyCooldown: new Date().getTime()
                            });
                            newBump.save((error) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    message.channel.send(`Bump data saved to database! I'll remind you in two hours to bump again...`);
                                }
                            });
                        } else {
                            res.BumpTime = new Date().getTime() + 7200000;
                            res.notifyCooldown= new Date().getTime();
                            res.save().catch(err => console.log(err));
                            message.channel.send(`Bump data saved to database! I'll remind you in two hours to bump again.`);
                        }
                    });



                    // Save the new bump document to the database

                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });

            // Create a new bump document with the serverID and the current time

        }
    }

    //check if there are bumps already in the database that are 2 hours old, or older. 
        // Get the current time
        const currentTime = new Date();

        // Find all bumps in the database that are older than 2 hours
        Bump.findOne({
            serverID: message.guildId,
        }, (err, res) => {

            if (err) return console.log(err);
            if (!res) return console.log("no results");
            if (message.author.bot) return;
            if (res.bumpTime < currentTime && res.notifyCooldown < currentTime) {
 
                    res.notifyCooldown = new Date().getTime() + 180000
                    res.save().catch(err => console.log(err));
                    message.channel.send('There are bumps that are older than 2 hours!');
    
            }
        });
    //  setInterval(checkBumpTime, 2 * 60 * 60 * 1000);

    //end development section
    if (message.author.bot) return;
    Balance.findOne({
        serverID: message.guildId,
        userID: message.author.id
    }, async (err, res) => {
        if (err) return console.log(err);
        if (res) {
            var timenow = new Date().getTime();
            let cooled = timenow - 20 * 1000;

            if (cooled > res.cooldown) {

                var casham = math.ceil(math.random() * 25);
                console.log(casham)
                res.balance = parseInt(res.balance + casham);
                res.cooldown = new Date().getTime()
                res.save().catch(err => console.log(err));
                console.log(res.cooldown)
            }

        } else {
            console.log(message.author.username + "#" + message.author.discriminator);
            const usernamestring = `${message.author.username}#${message.author.discriminator}`
            const newdoc = new Balance({
                userID: message.author.id,
                serverID: message.guildId,
                username: usernamestring,
                balance: 100,
                cooldown: new Date().getTime()
            })
            await newdoc.save().catch(err => console.log(err));
        }
    })
    //message.channel.send("test")
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    var prefix = config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const nanargs = message.content.split(/ +/g)
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) return;
    if (command === "eval") {
        if (message.author.id !== "608802993810440223" && message.author.id !== "149686265271418880" && message.author.id !== "221442254504591360") {
            return message.channel.send("USER NOT AUTHORIZED");
        }
        try {
            const code = args.join(" ");

            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            message.channel.send(clean(evaled), {
                code: "xl"
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    const cmd = client.commands.get(command);
    if (!cmd) return;
    console.log("success")
    await cmd.execute(client, message, args);
});



client.login(process.env.BOT_TOKEN)