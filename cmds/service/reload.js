const fs = require('fs');
const config = require('../../config.json')

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	arguments: '[cmdname]',
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (message.author.id != config.creatorid) return message.channel.send(`You are not creator of this bot`)
		if (!command) return message.channel.send(`There is no command with name or \`${commandName}\`!`);

		const cmddir = fs.readdirSync(`./${config.cmddir}`);
		const dir = cmddir.find(folder => fs.readdirSync(`./${config.cmddir}/${folder}`).includes(`${commandName}.js`));

		delete require.cache[require.resolve(`../${dir}/${command.name}.js`)];

		try {
			const newCommand = require(`../${dir}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};