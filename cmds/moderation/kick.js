const Discord = require('discord.js');
const logs = require('../../config.json').logs;

module.exports = {
    name: 'kick',
    description: 'Kicks member from server',
    arguments: '[user] (reason)',
    execute(message, args) {
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
        if (!kUser) return message.channel.send('Can\'t find user!');
        let kickReason = args[1];
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('You have no permissions to ban/kick!');
        if (kUser.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('That person can\'t be kicked!');

        let kickEmbed = new Discord.MessageEmbed()
            .setDescription('~Kick~')
            .setColor('#e56b00')
            .addField('Kicked User', `${kUser} with ID ${kUser.id}`)
            .addField('Kicked By', `<@${message.author.id}> with ID ${message.author.id}`)
            .addField('Kicked In', `${message.channel}`)
            .addField('Tiime', `${message.createdAt}`)
            .addField('Reason', kickReason);

        let kickChannel = message.guild.channels.cache.find(c => c.name === logs);
        if (kickChannel) kickChannel.send(kickEmbed);

        message.guild.member(kUser).kick(kickReason);
    },
};
