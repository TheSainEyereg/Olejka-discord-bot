const fs = require("fs")

module.exports = {
	name: "prefix",
	description: "Set bot prefix",
	arguments: "[new prefix]",
	execute(message, args) {
		const servers = require("../../servers.json")
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You have no permissions to change settings!");
		if (!args) return message.channel.send("Please, enter new prefix!")
		if (args[0].length > 3) return message.channel.send("Max prefix length is 3!")
		servers[message.guild.id].prefix = args[0]
		fs.writeFile("servers.json", JSON.stringify(servers, null, "\t"), "utf8", _ => {return})
		message.channel.send(`Prefix set to "${args[0]}"`)
	}
}