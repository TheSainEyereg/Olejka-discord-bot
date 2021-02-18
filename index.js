const Discord = require("discord.js");
const config = require("./config.json");
const prefix = config.prefix

const bot = new Discord.Client();

bot.on('message', message => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;

    const body = message.content.slice(prefix.length);
    const args = body.split(' ');
    const command = args.shift().toLowerCase();

})

bot.login(config.token);