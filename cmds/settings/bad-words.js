const fs = require('fs')

module.exports = {
	name: 'bad-words',
	description: 'Add/Remove bad words to/from list',
	arguments: 'add/remove [word(s)(use space for multiply words)]',
	execute(message, args) {
		const servers = require('../../servers.json')
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You have no permissions to change settings!');
		if (!args) return message.channel.send('Please, enter bad words :)')
		let words = args.slice(1)
		let bwords = servers[message.guild.id].badwords
		switch (args[0]) {
			case 'add':	
				if (words.length == 1) {
					if (bwords.includes(words[0])) return message.channel.send(`"${words[0]}" already exist!`)
					bwords.push(words[0])
					message.channel.send(`Added "${words[0]}" to list`)
				} else {
					for (let i in words) {
						if (bwords.includes(i)) continue
						bwords.push(words[i])
					}
					message.channel.send(`Added "${words.join(', ')}" to list`)
				}
				break
				
			case 'remove':
				let word = bwords.indexOf(words[0])
				if (!bwords.includes(words[0])) return message.channel.send(`"${words[0]}" is not in list`)
				bwords.splice(word, 1)
				message.channel.send(`Removed "${words[0]}" from list`)
				break

			default:
				message.channel.send('Please provide "add" or "remove" operators!')
				break
		}
		fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
	}
}