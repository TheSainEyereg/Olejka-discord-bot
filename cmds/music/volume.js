const fs = require('fs')

module.exports = {
	name: 'volume',
	description: 'Volume command.',
	arguments: '[volume (max 100)]',
	execute(message, args) {
		const { channel } = message.member.voice
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!')
		const serverQueue = message.client.queue.get(message.guild.id)
		if (!serverQueue) return message.channel.send('There is nothing playing.')
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`)
		if (args[0].length > 4) return message.channel.send('**Too much symbols!**')
		if (!parseInt(args[0])) return message.channel.send('This must be number.')
		if (parseInt(args[0])<1) return message.channel.send(`Volume ${args[0]} is too small (min volume is 1)`)
		if (parseInt(args[0])>100 && args[1]!='overdrive') return message.channel.send(`Volume ${args[0]} is too big (max volume is 100)`)
		if (parseInt(args[0])>1000 && args[1]=='overdrive') return message.channel.send('Max overdrive volume is 1000')
		if (args[1]=='overdrive') message.channel.send(`Prepare your eardrums :smiling_imp:`)
		[serverQueue.volume] = args
		serverQueue.volume = args[0]
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] /100)
		if (args[1] != 'overdrive') {
			try {
				let servers = require('../../servers.json')
				servers[message.guild.id].volume = parseInt(args[0])
				fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
			} catch (e) {console.log(e)}
		}
		return message.channel.send(`I set the volume to: **${args[0]}**`)
	}
}
