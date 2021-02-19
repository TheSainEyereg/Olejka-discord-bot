module.exports = {
	name: 'help',
	description: 'Displays list of commands',
	arguments: '(category)',
	execute(message, args) {
		message.channel.send(`
		List of commands:
			Nothing because I'll do help command later.
			Commands at 18.02.21: "help", "ping", "clear", "say", "user-info", "server-info"
		`)        
	}
};