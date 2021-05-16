const fs = require('fs')

module.exports = {
	name: 'log-channel',
	description: 'Changes default logs channel',
	arguments: '[channel]',
	execute(message, args) {
		const servers = require('../../servers.json')
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You have no permissions to change settings!');
		if (!args) return message.channel.send('Please, enter new log channel!')
		servers[message.guild.id].logs = args[0]
		fs.writeFile('servers.json', JSON.stringify(servers, null, '\t'), 'utf8', _ => {return})
		message.channel.send(`Set logs channel to "${args[0]}"`)
	}
}