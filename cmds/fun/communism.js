const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	name: 'communism',
	description: 'Stolen idea from BoobBot',
	arguments: '(user)',
	async execute(message, args) {
		let user = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));

		const canvas = Canvas.createCanvas(256, 256);
		const ctx = canvas.getContext('2d');

		const avatar = await Canvas.loadImage(user.user.displayAvatarURL({ format: 'jpg' }));
		const background = await Canvas.loadImage('https://olejka.ru/s/63674.png');

		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 0.6
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'communism.png');
		message.channel.send(attachment);
	}
};

//https://olejka.ru/s/63674.png