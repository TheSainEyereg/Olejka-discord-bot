module.exports = {
	name: 'user-info',
	description: 'Gives user info',
	arguments: '(user)',
	execute(message) {
		message.channel.send(`Your discord ID is ${message.author.id} \nUser: ${message.author.username}`);
	},
};