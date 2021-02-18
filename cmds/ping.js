module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! Got answer after ${timeTaken}ms.`);
	},
};