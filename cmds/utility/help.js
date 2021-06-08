const { throws } = require('assert');
const fs = require('fs')
const config = require('../../config.json')

module.exports = {
	name: 'help',
	description: 'Displays list of commands',
	arguments: '(category)',
	execute(message, args) {
		const servers = require('../../servers.json')
		const out = []
		category = args[0]
		if (category) category = category.replace(/\\|\//g,'');
		if (!category) {
			out.push(`Here is my commands categories:`)
			const cmddir = fs.readdirSync(`./${config.cmddir}`)
			for (let dir in cmddir) out.push(`	**${cmddir[dir]}**`)
			out.push(`Type ${servers[message.guild.id].prefix}help (category) for list commands.`)
			message.channel.send(out)
			return
		}
		try {
			out.push(`Commands list of category \`${category}\`:`)
			const cmds = fs.readdirSync(`./${config.cmddir}/${category}`)
			for (let file in cmds) out.push(`	**${servers[message.guild.id].prefix}${require(`../${category}/${cmds[file]}`).name} ${require(`../${category}/${cmds[file]}`).arguments}** — ${require(`../${category}/${cmds[file]}`).description}`)
			message.channel.send(out)
		} catch (e) {
			message.channel.send(`Category \`${category}\` not found!`)
		}
	}
};