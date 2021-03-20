module.exports = {
	name: 'volume',
	description: 'Volume command.',
	arguments: '[volume (max 100)]',
	execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		if (!parseInt(args[0])) return message.channel.send('This must be number.');
		if (parseInt(args[0]) >100) return message.channel.send(`Volume ${args[0]} is too big (max volume is 100)`)
		if (parseInt(args[0])<1) return message.channel.send(`Volume ${args[0]} is too small (min volume is 1)`)
		[serverQueue.volume] = args;
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] /100);
		return message.channel.send(`I set the volume to: **${args[0]}**`);
	}
};
