const Discord = require('discord.js');
const logs = require('../../config.json').logs;

module.exports = {
    name: 'kick',
    description: 'Kicks member from server',
    arguments: '[user] (reason)',
    execute(message, args) {
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.channel.send('Can\'t find user!');
        let reason = args.slice(1).join(' ');
        if (!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.hasPermission('ADMINISTRATOR'))
            return message.channel.send('You have no permissions to ban/kick!');
        if (user.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('That person can\'t be kicked!');

        let kickEmbed = new Discord.MessageEmbed()
            .setDescription('~Kick~')
            .setColor('#f0fa32')
            .addField('Kicked User', `${user} with ID ${user.id}`)
            .addField('Kicked By', `<@${message.author.id}> with ID ${message.author.id}`)
            .addField('Kicked In', `${message.channel}`)
            .addField('Tiime', `${message.createdAt}`)
            .addField('Reason', reason);

        let kickChannel = message.guild.channels.cache.find(c => c.name === logs);
        if (kickChannel) kickChannel.send(kickEmbed);

        message.guild.member(user).kick(reason);
    },
};
