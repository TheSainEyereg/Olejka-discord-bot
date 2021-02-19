module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.channel.send(`Pong! Answer taken ${timeTaken}ms.`);
	}
};