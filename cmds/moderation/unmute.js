module.exports = {
	name: 'unmute',
	description: 'Unmutes muted member',
	arguments: '[user]',
	async execute(message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permissions to use this command');
      
        let toMute = message.mentions.users.first() || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send('You did not specify a user to unmute!');
      
        let role = message.guild.roles.find(r => r.name === 'Muted');
      
        if(!role || !toMute.roles.has(role.id)) return message.channel.send('This user is not muted!');
      
        await toMute.removeRole(role);
        message.channel.send('User unmuted.');
        
	}
};