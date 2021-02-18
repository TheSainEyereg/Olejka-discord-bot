module.exports = {
	name: 'server-info',
	description: 'Gives server info',
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}, \nServer members count: ${message.guild.memberCount}`);
	},
};