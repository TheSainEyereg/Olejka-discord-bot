module.exports = {
	name: 'say',
	description: 'Repeat given word',
	arguments: '[word to say]',
	execute(message, args) {
		if (!args[0]) return message.channel.send('Nothing to say')
        message.channel.send(args.join(' ').replace(/@/g,''))
	}
};