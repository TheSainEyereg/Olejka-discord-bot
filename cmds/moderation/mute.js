const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mutes member on server',
    arguments: '[user] (duration (mins)) (reason)',
    async execute(message, args) {
        try {
            if (!message.member.hasPermission('MUTE_MEMBERS') || !message.member.hasPermission('ADMINISTRATOR')) {
                const mods = require('../../servers.json')[message.guild.id].moders
                if (!mods.includes(message.author.id)) return message.channel.send('You do not have permissions to use this command')
            }
            let user = message.guild.member(message.mentions.users.first())
            if (!user) return message.channel.send('Couldn\'t find user.')
            //if (user.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Can\'t mute them!')
            let muterole = message.guild.roles.cache.find(r => r.name === 'Muted')
            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                            data: {
                                name: 'Muted',
                                color: '#000000',
                                permissions: []
                            }
                    });
                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.updateOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            SPEAK: false
                        });
                    });
                } catch (e) {
                    console.log(e.stack)
                }
            }
    
            let mutetime = args[1];
            let reason = args.slice(2).join(' ')
            if (!parseInt(mutetime)) { mutetime = 'Permanent'; reason = args.slice(1).join(' ')}
            if (!reason) reason = 'No reason'
    
            let muteEmbed = new Discord.MessageEmbed()
                .setDescription('~Mute~')
                .setColor('#fab132')
                .addField('Muted User', `${user} with ID ${user.id}`)
                .addField('Muted By', `<@${message.author.id}> with ID ${message.author.id}`)
                .addField('Muted In', `${message.channel}`)
                .addField('Muted For', `${mutetime} min`)
                .addField('Tiime', `${message.createdAt}`)
                .addField('Reason', reason)
    
            try {
                let logs = require('../../servers.json')[message.guild.id].logs
                let muteChannel = message.guild.channels.cache.find(c => c.name === logs)
                if (muteChannel) muteChannel.send(muteEmbed)
            } catch (e) {console.error(e)}

            let DMEmbed = new Discord.MessageEmbed()
                .setDescription('You has been muted!')
                .setColor('#fab132')
                .addField('Mute reason:', reason)
                .addField('Muted For', `${mutetime} min`)
                .addField('Muted By',`<@${message.author.id}> with ID ${message.author.id}` )
    
            await user.roles.add(muterole.id)
            if (parseInt(mutetime)) {
                message.channel.send(`<@${user.id}> has been muted for ${mutetime} min`)
                setTimeout(() => {
                    try {
                        user.roles.remove(muterole);
                    } catch(e) {
                        console.error(e)
                        return
                    }
                    message.channel.send(`<@${user.id}> has been unmuted!`)
                }, ms(mutetime)*1000*60);
            } else {
                message.channel.send(`<@${user.id}> has been muted for permanent`)
            }    
        } catch (e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``)
        }
    }
};
