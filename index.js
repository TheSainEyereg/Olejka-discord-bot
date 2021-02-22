const Discord = require("discord.js");
const fs = require('fs')

const config = require("./config.json");
const token = config.token
const prefix = config.prefix
const cmds = config.cmddir

const bot = new Discord.Client();

bot.on("ready", _ => {
    bot.user.setActivity(`Prefix ${prefix} type ${prefix}help for help`);
    console.log(`${bot.user.username} started \nBot is working on ${bot.guilds.cache.size} servers!`);
});

bot.commands = new Discord.Collection();
bot.queue = new Map() //For music
const commandFolder = fs.readdirSync(`./${cmds}`);

for (const folder of commandFolder) {
	const commandFile = fs.readdirSync(`./${cmds}/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFile) {
		const command = require(`./${cmds}/${folder}/${file}`);
		bot.commands.set(command.name, command);
	}
}

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const body = message.content.slice(prefix.length);
    const args = body.split(' ');
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) {message.channel.send(`No command found\nType ${prefix}help for help`); return}
	try {
		bot.commands.get(command).execute(message, args);
	} catch (error) {
		message.channel.send(`Error occured!\n\`\`\`${error}\`\`\``);
		console.error(error)
	}

})

bot.login(token);