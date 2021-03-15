const Discord = require('discord.js');
const logs = require('../../config.json').logs;

module.exports = {
    name: 'ban',
    description: 'Bans member from server',
    arguments: '[user] (reason)',
    execute(message, args) {
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.channel.send('Can\'t find user!');
        let reason = args.slice(1).join(' ');;
        if (!message.member.hasPermission('MANAGE_MEMBERS'))
            return message.channel.send('You have no permissions to ban/ban!');
        if (user.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('That person can\'t be banned!');

        let banEmbed = new Discord.MessageEmbed()
            .setDescription('~Ban~')
            .setColor('#fa3232')
            .addField('Banned User', `${user} with ID ${user.id}`)
            .addField('Banned By',`<@${message.author.id}> with ID ${message.author.id}` )
            .addField('Banned In', message.channel)
            .addField('Time', message.createdAt)
            .addField('Reason', reason);

        let banChannel = message.guild.channels.cache.find(c => c.name === logs);
        if (banChannel) banChannel.send(banEmbed);

        message.guild.member(user).ban(reason);
    },
};
