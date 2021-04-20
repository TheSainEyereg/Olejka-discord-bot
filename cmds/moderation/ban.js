const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans member from server',
    arguments: '[user] (reason)',
    execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS') || !message.member.hasPermission('ADMINISTRATOR')) {
            let mods = []
            try {    
                mods = require('../../servers.json')[message.guild.id].moders
            } catch (e) {console.log(e)}
            if (!mods.includes(message.author.id)) return message.channel.send('You have no permissions to ban!')
        }
        let user = message.guild.member(message.mentions.users.first())
        if (!user) return message.channel.send('Can\'t find user!')
        let reason = args.slice(1).join(' ')
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

        message.guild.member(user).ban(reason)
    }
}
