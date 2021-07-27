module.exports = {
	name: 'invite',
	description: 'Gives you ivite for your server',
	arguments: '',
	execute(message) {
		message.channel.send(require('../../config.json').invite);
	},
};