module.exports = {
	name: 'invite',
	description: 'Gives you ivite for your server',
	arguments: '',
	execute(message) {
		message.channel.send('https://discord.com/api/oauth2/authorize?client_id=811917363373015110&permissions=8&scope=bot');
	},
};