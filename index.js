const Discord = require("discord.js")
const fs = require('fs')

const config = require("./config.json")
const token = config.token
const prefix = config.prefix
const cmds = config.cmddir

const bot = new Discord.Client()

bot.on('unhandledRejection', e => console.error(`Unhandled promise rejection error: ${e}`))
bot.on('shardError', e => console.error(`Websocket connection error: ${e}`));
bot.on('error', e => console.log(`Another error: ${e}`))
bot.on('warn', e => console.warn(`Warning: ${e}`))

bot.on('disconnect', _ => console.log('Looks like connection was lost, I will reconnect immediately when coonection appears.'))
bot.on('reconnecting', _ => console.log('Im reconnectiong now...'))

bot.on('ready', _ => {
    bot.user.setActivity(`Prefix ${prefix} type ${prefix}help for help`)
	console.log('Successfully connected to API!')
    console.log(`${bot.user.username} started \nBot is working on ${bot.guilds.cache.size} servers!`)
});

bot.commands = new Discord.Collection()
bot.queue = new Map() //For music
const commandFolder = fs.readdirSync(`./${cmds}`)

for (const folder of commandFolder) {
	const commandFile = fs.readdirSync(`./${cmds}/${folder}`).filter(file => file.endsWith('.js'))
	for (const file of commandFile) {
		const command = require(`./${cmds}/${folder}/${file}`)
		bot.commands.set(command.name, command)
	}
}

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return

    const body = message.content.slice(prefix.length)
    const args = body.split(' ')
    const command = args.shift().toLowerCase()

    if (!bot.commands.has(command)) return message.channel.send(`No command found\nType ${prefix}help for help`)
	try {
		bot.commands.get(command).execute(message, args)
	} catch (error) {
		message.channel.send(`Error occured!\n\`\`\`${error}\`\`\``)
		console.error(error)
	}

})

bot.login(token);