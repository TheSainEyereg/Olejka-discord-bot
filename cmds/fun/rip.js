const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
	name: "rip",
	description: "Kills person >:)",
	arguments: "(user)",
	async execute(message, args) {
		try {
			const user = message.guild.member(message.mentions.users.first()) || message.guild.member(message.client. users.cache.find(user => user.username == args[0])) || message.guild.member(message.author)
			if (!user) return message.channel.send("Can't find user :/");
	
			const canvas = Canvas.createCanvas(653, 425);
			const ctx = canvas.getContext("2d");
			ctx.font = "40px sans-serif";
			ctx.fillStyle = "#010101";
	
			const background = await Canvas.loadImage("https://olejka.ru/s/92385.jpg");
			const avatar = await Canvas.loadImage(user.user.avatarURL({ format: "jpg", size: 512 }));
			let t = new Date()
	
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(avatar, canvas.width/2-125/2-20, 80, 125, 125);
			ctx.fillText(user.displayName, canvas.width/2-24*user.displayName.length/2, 260);
			ctx.fillText(`${t.getDate()}.${t.getMonth()+1}.${t.getFullYear()}`,canvas.width/2-22*10/2, 300);
	
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "Tombstone.png");
			message.channel.send(attachment);
		} catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);
		}
	}
}

//https://olejka.ru/s/92385.jpg