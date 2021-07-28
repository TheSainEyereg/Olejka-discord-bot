const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
	name: "communism",
	description: "Stolen idea from BoobBot",
	arguments: "(user)",
	async execute(message, args) {
		try {
			const user = message.guild.member(message.mentions.users.first()) || message.guild.member(message.client. users.cache.find(user => user.username == args[0])) || message.guild.member(message.author)
			if (!user) return message.channel.send("Can't find user :/");
	
			const canvas = Canvas.createCanvas(512, 512);
			const ctx = canvas.getContext("2d");
	
			const avatar = await Canvas.loadImage(user.user.avatarURL({ format: "jpg", size: 512 }));
			const background = await Canvas.loadImage("https://olejka.ru/s/63674.png");
	
			ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 0.6
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "communism.png");
			message.channel.send(attachment);
		} catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);
		}
	}
};

//https://olejka.ru/s/63674.png