module.exports = {
	name: 'ping',
	description: 'Ping!',
	arguments: '',
	execute(message, args) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.channel.send(`Pong! Answer taken ${timeTaken}ms.`);
	}
};