module.exports = {
	name: 'user-info',
	description: 'Gives user info',
	execute(message) {
		message.channel.send(`Your discor ID is ${message.author.id} \nUser: ${message.author.username}`);
	},
};