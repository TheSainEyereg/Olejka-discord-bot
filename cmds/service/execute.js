const config = require('../../config.json')

module.exports = {
	name: 'execute',
	description: 'Executes script',
	arguments: '[JS code]',
	async execute(message, args) {
        try {
            if (message.author.id != config.creatorid) return message.channel.send(`You are not creator of this bot!`)
		    if (!args) return message.channel.send(`You are not gave any script to execute!`);
            try {
                eval(args[0])
            } catch (e) {
                return message.channel.send(`Error in execution occured! (\`${e}\`)`);                      
            }
        } catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);            
        }
	}
};