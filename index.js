const Discord = require("discord.js")
const fs = require("fs")

const bot = new Discord.Client()
bot.commands = new Discord.Collection()
bot.cooldowns = new Discord.Collection();
bot.queue = new Map() //For music

const config = require("./config.json")
if (!config) return console.log("No config.json found! Please create it!")
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
const svcfgCreate = _ => {
	process.stdout.write(`No servers config found, creating one...\r`)
	const guilds = bot.guilds.cache.map(guild => guild.id)
	let servers = {}
	for (let i in guilds) {
		servers[guilds[i]] = svdefault
	}
	fs.writeFile("servers.json", JSON.stringify(servers, null, "\t"), "utf8", _ => {return})
	process.stdout.write(`No servers config found, creating one...OK\nFound ${guilds.length} guilds.\n`)
}

process.on("unhandledRejection", e => console.error(`Unhandled promise rejection error: ${e}`))

bot.on("shardError", e => console.error(`Websocket connection error: ${e}`))
bot.on("error", e => console.error(`Another error: ${e}`))
bot.on("warn", e => console.warn(`Warning: ${e}`))

bot.on("disconnect", _ => console.log("Looks like connection was lost, I will reconnect immediately when coonection appears."))
bot.on("reconnecting", _ => console.log("Im reconnecting now..."))
bot.on("resume", _ => console.log("Reconnected!"))

bot.on("ready", _ => {
    bot.user.setActivity(`Default prefix is ${prefix}`)
	console.log("Successfully connected to API!")
	try {require("./servers.json")} catch (e) {svcfgCreate()}
    console.log(`${bot.user.username} started \nBot is working on ${bot.guilds.cache.size} servers!`)
})

bot.on("guildCreate", guild => {
    console.log(`Joined ${guild.name}`)
	process.stdout.write("Trying to create cfg...\r")
	try {
		delete require.cache[require.resolve("./servers.json")];
		let servers = require("./servers.json")
		if (servers[guild.id]) return process.stdout.write("Trying to create server cfg...ALREADY\n")
		servers[guild.id] = svdefault
		fs.writeFile("servers.json", JSON.stringify(servers, null, "\t"), "utf8", _ => {return})
		process.stdout.write("Trying to create server cfg...OK\n")
	} catch (e) {
		process.stdout.write("Trying to create server cfg...NOT_FOUND\n")
		svcfgCreate()
	}
})

for (const folder of fs.readdirSync(`./${cmds}`)) {
	const commandFile = fs.readdirSync(`./${cmds}/${folder}`).filter(file => file.endsWith(".js"))
	for (const file of commandFile) {
		const command = require(`./${cmds}/${folder}/${file}`)
		bot.commands.set(command.name, command)
	}
}

bot.on("message", message => {
	if (message.author.bot) return
	if (message.channel.type === "dm") return message.channel.send("I\"m mot working with DM! Please use me on server!");

	try {
		delete require.cache[require.resolve("./servers.json")]
		require("./servers.json");
	} catch (e) {
		svcfgCreate();
		return message.channel.send("Looks like your server config wasn\"t found so we created one, please execute command again!");
	}
	if (!message.guild) return; //I dont f**king know why 74 line return doesn"t working
	
	const svprefix = require("./servers.json")[message.guild.id].prefix;
	
	if (message.content.startsWith(prefix) && !message.content.startsWith(svprefix)) return message.channel.send(`Prefix for this server is \`${svprefix}\``);
    if (!message.content.startsWith(svprefix)) return;

    const body = message.content.slice(svprefix.length);
    const args = body.split(" ");
    const command = args.shift().toLowerCase().replace(/\ /g,"");
	if (!command) return;

	const { cooldowns } = bot;
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const amount = config.cooldown * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + amount;
		if (now < expirationTime) return
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), amount);

    if (!bot.commands.has(command)) return message.channel.send(`No command found\nType ${svprefix}help for help`);
	if (args.join("").length > 1000) return message.channel.send(`Too much symbols for command (max is 1000)`);
	try {
		bot.commands.get(command).execute(message, args);
	} catch (error) {
		message.channel.send(`Error occured!\n\`\`\`${error}\`\`\``);
		console.error(error);
	}

})

bot.login(token);