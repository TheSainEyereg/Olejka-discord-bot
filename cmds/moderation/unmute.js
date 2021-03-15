module.exports = {
	name: 'unmute',
	description: 'Unmutes muted member',
	arguments: '[user]',
	async execute(message, args) {
                try {
                        if(!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command');
                        let user = message.guild.member(message.mentions.users.first());
                        if(!user) return message.channel.send('You did not specify a user to unmute!');
                        let role = message.guild.roles.cache.find(r => r.name === 'Muted')
                        if(!role || !user.roles.cache.find(r => r.name === 'Muted')) return message.channel.send('This user is not muted!');
                        await user.roles.remove(role);
                        message.channel.send('User unmuted.');  
                } catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``);
                }
	}
};