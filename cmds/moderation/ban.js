const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans member from server',
    arguments: '[user] (remove messages count (days)) (reason)',
    execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS') || !message.member.hasPermission('ADMINISTRATOR')) {
            const mods = require('../../servers.json')[message.guild.id].moders
            if (!mods.includes(message.author.id)) return message.channel.send('You have no permissions to ban!')
        }
        let user = message.guild.member(message.mentions.users.first())
        if (!user) return message.channel.send('Can\'t find user!')
        let messd = args[1];
        let reason = args.slice(2).join(' ')
        if (!parseInt(messd)) {reason = args.slice(1).join(' ')}
        let intmessd = parseInt(messd)
        if (intmessd > 7) return message.channel.send('Can\'t remove messages older than 7 days!')
        if (!reason) reason = 'No reason'
        if (user.hasPermission('MANAGE_MESSAGES')) return message.channel.send('That person can\'t be banned!')

        let banEmbed = new Discord.MessageEmbed()
            .setDescription('~Ban~')
            .setColor('#fa3232')
            .addField('Banned User', `${user} with ID ${user.id}`)
            .addField('Banned By',`<@${message.author.id}> with ID ${message.author.id}` )
            .addField('Banned In', message.channel)
            .addField('Time', message.createdAt)
            .addField('Reason', reason)

        try {
			let logs = require('../../servers.json')[message.guild.id].logs
            let banChannel = message.guild.channels.cache.find(c => c.name === logs)
            if (banChannel) banChannel.send(banEmbed)
        } catch (e) {console.error(e)}

        let DMEmbed = new Discord.MessageEmbed()
            .setDescription('You has been banned!')
            .setColor('#fa3232')
            .addField('Ban reason:', reason)
            .addField('Banned By',`<@${message.author.id}> with ID ${message.author.id}` )

        message.guild.member(user).ban({ days: intmessd, reason: reason })
    }
}
