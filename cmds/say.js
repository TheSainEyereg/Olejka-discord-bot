module.exports = {
	name: 'say',
	description: 'Repeat given word',
	execute(message, args) {
        message.channel.send(args[0]);        
	}
};