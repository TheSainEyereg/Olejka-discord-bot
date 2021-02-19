module.exports = {
	name: 'args-info',
	description: 'Gives args info.',
	execute(message, args) {
		if (!args.length) return message.channel.send(`No arguments given!`)
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};