const Discord = require("discord.js");
const fs = require('fs')

const config = require("./config.json");
const token = config.token
const prefix = config.prefix
const cmds = config.cmdDir

const bot = new Discord.Client();

bot.on("ready", _ => {
    bot.user.setActivity(`Bot prefix ${prefix} type help for help`);
    console.log(`${bot.user.username} started`);
});

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./${cmds}`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./${cmds}/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const body = message.content.slice(prefix.length);
    const args = body.split(' ');
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) return;
	try {
		bot.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('No command found or error occured!');
	}

})

bot.login(token);