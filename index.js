const Discord = require("discord.js")
const fs = require('fs')

const config = require("./config.json")
if (!config) return console.log('No config.json found! Please create it!')
const token = config.token
const prefix = config.prefix
const cmds = config.cmddir
const svdefault = {
	prefix: config.prefix,
	logs: config.logs,
	volume: 75,
	moders: [],
	badwords: []
}
const bot = new Discord.Client()
const svcfgCreate = _ => {
	process.stdout.write('No servers congig found, creating one...\r')
	const guilds = bot.guilds.cache.map(guild => guild.id);
	console.log(`Found ${guilds.length} guilds`)
	let servers = {}
	for (let i in guilds) {
		servers[guilds[i]] = svdefault
	}
	fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
	process.stdout.write('No servers congig found, creating one...OK\n')
}

bot.on('unhandledRejection', e => console.error(`Unhandled promise rejection error: ${e}`))
bot.on('shardError', e => console.error(`Websocket connection error: ${e}`));
bot.on('error', e => console.error(`Another error: ${e}`))
bot.on('warn', e => console.warn(`Warning: ${e}`))

bot.on('disconnect', _ => console.log('Looks like connection was lost, I will reconnect immediately when coonection appears.'))
bot.on('reconnecting', _ => console.log('Im reconnecting now...'))

bot.on('ready', _ => {
    bot.user.setActivity(`Prefix ${prefix} type ${prefix}help for help`)
	console.log('Successfully connected to API!')
	try {
		require('./servers.json')
	} catch (e) {
		svcfgCreate()
	}
    console.log(`${bot.user.username} started \nBot is working on ${bot.guilds.cache.size} servers!`)
});

bot.on("guildCreate", guild => {
    console.log(`Joined ${guild.name}`);
	process.stdout.write('Trying to create cfg...\r')
	try {
		let servers = require('./servers.json')
		if (servers[guild.id]) return process.stdout.write('Trying to create server cfg...ALREADY\n')
		servers[guild.id] = svdefault
		fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
		process.stdout.write('Trying to create server cfg...OK\n')
	} catch (e) {
		process.stdout.write('Trying to create server cfg...NOT_FOUND\n')
		svcfgCreate()
	}
})

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
	let svprefix = prefix;
	try {
		svprefix = require('./servers.json')[message.guild.id].prefix
	} catch (e) {svcfgCreate()}
	if (message.mentions.has(bot.user) || (message.content.startsWith(prefix) && !message.content.startsWith(svprefix))) return message.channel.send(`Prefix for this server is "${svprefix}"`)
    if (!message.content.startsWith(svprefix) || message.author.bot || message.channel.type === 'dm') return

    const body = message.content.slice(svprefix.length)
    const args = body.split(' ')
    const command = args.shift().toLowerCase()

    if (!bot.commands.has(command)) return message.channel.send(`No command found\nType ${svprefix}help for help`)
	if (args.join('').length > 1000) return message.channel.send(`Too much symbols for command (max is 1000)`)
	try {
		bot.commands.get(command).execute(message, args)
	} catch (error) {
		message.channel.send(`Error occured!\n\`\`\`${error}\`\`\``)
		console.error(error)
	}

})

bot.login(token);