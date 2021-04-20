const fs = require('fs')

module.exports = {
	name: 'moderator',
	description: 'Add/Remove bot moderator',
	arguments: 'add/remove [user]',
	execute(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You have no permissions to change settings!');
		if (!args) return message.channel.send('Please, mention moderator!')
		let user = message.guild.member(message.mentions.users.first())
		if (!user) return message.channel.send('Can\'t find user!')
		try {
			let servers = require('../../servers.json')
			let mods = servers[message.guild.id].moders
			switch (args[0]) {
				case 'add':	
					if (mods.includes(user.id)) return message.channel.send('User already is a moderator!')
					mods.push(user.id)
					message.channel.send(`Added ${user} to list`)
					break
			
				case 'remove':
					if (!mods.includes(user.id)) return message.channel.send('User is not a moderator!')
					let mod = mods.indexOf(user.id)
					mods.splice(mod, 1)
					message.channel.send(`Removed ${user} from list`)
					break

				default:
					message.channel.send('Please provide "add" or "remove" operators!')
					break
			}
			fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
		} catch (e) {
			message.channel.send(`Server cfg not found, contact bot creator/hoster or open github issue (type !github)\n\`${e}\``)
		}
	}
}