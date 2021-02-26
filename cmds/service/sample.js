module.exports = {
	name: 'sample',
	description: 'sample',
	arguments: '[sample] (sample) {sample}',
	execute(message, args) {
        message.channel.send('sample')
	}
};