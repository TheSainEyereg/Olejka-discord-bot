const fs = require('fs')

module.exports = {
	name: 'prefix',
	description: 'Set bot prefix',
	arguments: '[new prefix]',
	execute(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You have no permissions to change settings!');
		if (!args) return message.channel.send('Please, enter new prefix!')
		try {
			let servers = require('../../servers.json')
			servers[message.guild.id].prefix = args[0]
			fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
			message.channel.send(`Prefix set to "${args[0]}"`)
		} catch (e) {
			message.channel.send(`Server cfg not found, contact bot creator/hoster or open github issue (type !github)\n\`${e}\``)
		}
	}
}