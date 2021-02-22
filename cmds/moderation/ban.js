const logs = require('../../config.json').logs

module.exports = {
	name: 'ban',
	description: 'Bans member from server',
	arguments: '[user] (reason)',
	async execute(message, args) {
		let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
		if(!bUser) return message.channel.send('Can\'t find user!');
		let bReason = args[1]
		if(!message.member.hasPermission('MANAGE_MEMBERS')) return message.channel.send('You have no permissions to ban/ban!');
		if(bUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send('That person can\'t be banned!');
	
		let banEmbed = new Discord.RichEmbed()
		.setDescription('~Ban~')
		.setColor('#bc0000')
		.addField('Banned User', `${bUser} with ID ${bUser.id}`)
		.addField('Banned By', `<@${message.author.id}> with ID ${message.author.id}`)
		.addField('Banned In', message.channel)
		.addField('Time', message.createdAt)
		.addField('Reason', bReason);
	
        let banChannel = message.guild.channels.find(`name`, logs);
        if(banChannel) banChannel.send(banEmbed);
	
		message.guild.member(bUser).ban(bReason);
	}
};