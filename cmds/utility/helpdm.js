const fs = require('fs')
const config = require('../../config.json')

module.exports = {
	name: 'helpdm',
	description: 'Displays list of commands in DM',
	arguments: '(category)',
	canDM: true,
	execute(message, args) {
const out = []
		if (!args[0]) {
			out.push(`Here is my commands categories:`)
			const cmds = fs.readdirSync(`./${config.cmddir}`)
			for (let i in cmds) out.push(`	**${config.prefix}${cmds[i]}**`)
			out.push(`Type ${config.prefix}help (category) for list commands`)
			
			return message.author.send(out, { split: true }).then(() => {
				if (message.channel.type === 'dm') return;
				message.reply(`Sent my cmds to your DM`);
			}).catch(error => {
				message.reply(`Looks like I can't DM you, make sure It's turned on`);
			});
		}       
	}
};