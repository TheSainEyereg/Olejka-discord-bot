module.exports = {
	name: 'server-info',
	description: 'Gives server info',
	arguments: '',
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}, \nServer members count: ${message.guild.memberCount}`);
	},
};