const fs = require('fs');
const config = require('../../config.json')

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	arguments: '[cmdname]',
	execute(message, args) {
		if (message.author.id != config.creatorid) return message.channel.send(`You are not creator of this bot`)
		if (!args) return message.channel.send('Nothing to reload!')
		const toReload = args[0].toLowerCase()
		const cmddir = fs.readdirSync(`./${config.cmddir}`)

		if (toReload == 'all') {
			message.channel.send('Reloading all cmds...')
            for (let dir in cmddir) {
                let files = fs.readdirSync(`./${config.cmddir}/${cmddir[dir]}`)
                for (let file in files){
                    delete require.cache[require.resolve(`../${cmddir[dir]}/${files[file]}`)]
                    try {
                        const newCommand = require(`../${cmddir[dir]}/${files[file]}`)
                        message.client.commands.set(newCommand.name, newCommand)
                    } catch (error) {
                        return message.channel.send(`Error in ${files[file]} reload: \`${error.message}\``)
                    }
                }
            }
            message.channel.send(`Successfully reloaded all commands!`)
		} else {
			const command = message.client.commands.get(toReload) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(toReload))
			if (!command) return message.channel.send(`There is no command with name or \`${toReload}\`!`)
			const dir = cmddir.find(folder => fs.readdirSync(`./${config.cmddir}/${folder}`).includes(`${toReload}.js`))
			delete require.cache[require.resolve(`../${dir}/${command.name}.js`)]
			try {
				const newCommand = require(`../${dir}/${command.name}.js`)
				message.client.commands.set(newCommand.name, newCommand)
				message.channel.send(`Command \`${command.name}\` was reloaded!`)
			} catch (error) {
				console.error(error)
				message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
			}
		}
	},
};