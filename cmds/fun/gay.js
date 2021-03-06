const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	name: 'gay',
	description: 'Makes someone gay',
	arguments: '(user)',
	async execute(message, args) {
		try {
			let user = message.guild.member(message.mentions.users.first());
			if (!user) return message.channel.send('User is not provided or not found')
	
			const canvas = Canvas.createCanvas(256, 256);
			const ctx = canvas.getContext('2d');
	
			const avatar = await Canvas.loadImage(user.user.displayAvatarURL({ format: 'jpg' }));
			const background = await Canvas.loadImage('https://olejka.ru/s/56907.png');
	
			ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 0.6
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'gay.png');
			message.channel.send(attachment);
		} catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);
		}
	}
};

//https://olejka.ru/s/56907.png