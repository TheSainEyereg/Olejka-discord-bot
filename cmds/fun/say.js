module.exports = {
	name: 'say',
	description: 'Repeat given word',
	arguments: '[word to say]',
	execute(message, args) {
        message.channel.send(args[0]);        
	}
};