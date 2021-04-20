const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks member from server',
    arguments: '[user] (reason)',
    execute(message, args) {
        if (!message.member.hasPermission('KICK_MEMBERS') || !message.member.hasPermission('ADMINISTRATOR')) {
            let mods = []
            try {
                mods = require('../../servers.json')[message.guild.id].moders
            } catch (e) {console.log(e)}
            if (!mods.includes(message.author.id)) return message.channel.send('You have no permissions to kick!')
        }
        let user = message.guild.member(message.mentions.users.first())
        if (!user) return message.channel.send('Can\'t find user!')
        let reason = args.slice(1).join(' ')
        if (!reason) reason = 'No reason'
        if (user.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('That person can\'t be kicked!')

        let kickEmbed = new Discord.MessageEmbed()
            .setDescription('~Kick~')
            .setColor('#f0fa32')
            .addField('Kicked User', `${user} with ID ${user.id}`)
            .addField('Kicked By', `<@${message.author.id}> with ID ${message.author.id}`)
            .addField('Kicked In', `${message.channel}`)
            .addField('Tiime', `${message.createdAt}`)
            .addField('Reason', reason)

            try {
                let logs = require('../../servers.json')[message.guild.id].logs
                let kickChannel = message.guild.channels.cache.find(c => c.name === logs)
                if (kickChannel) kickChannel.send(kickEmbed)
            } catch (e) {console.error(e)}
        message.guild.member(user).kick(reason)
    },
};
