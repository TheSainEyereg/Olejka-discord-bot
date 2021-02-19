module.exports = {
	name: 'say',
	description: 'Repeat given word',
	arguments: '[word to say]',
	execute(message, args) {
		if (!args[0]) {message.channel.send('No args provided'); return}
        message.channel.send(args[0]);        
	}
};