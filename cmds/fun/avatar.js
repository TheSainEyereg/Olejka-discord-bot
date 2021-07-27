const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
	name: "avatar",
	description: "Makes someone gay",
	arguments: "(user) (size)",
	async execute(message, args) {
		try {
			const user = message.guild.member(message.mentions.users.first()) || message.guild.member(message.client. users.cache.find(user => user.username == args[0])) || message.guild.member(message.author)
			if (!user) return message.channel.send("Can't find user :/");
	
			const avatar = await user.user.avatarURL({ format: "png", size: 1024 })
			const attachment = new Discord.MessageAttachment(avatar, "avatar.png");

			message.channel.send(attachment);
		} catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);
		}
	}
};

//https://olejka.ru/s/56907.png