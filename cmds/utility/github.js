module.exports = {
	name: 'github',
	description: 'Sends github repo',
	arguments: '',
	execute(message) {
		message.channel.send(require('../../package.json').repository.url.slice(4).split('.git'));
	},
};