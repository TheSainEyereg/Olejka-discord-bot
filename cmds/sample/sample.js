const { Channel } = require("discord.js");

module.exports = {
	name: 'sample',
	description: 'sample',
	execute(message, args) {
        message.channel.send('sample')
	}
};