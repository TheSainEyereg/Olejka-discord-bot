const Discord = require('discord.js');
const ms = require('ms');
const logs = require('../../config.json').logs;

module.exports = {
    name: 'mute',
    description: 'Mutes member on server',
    arguments: '[user] (duration (mins)) (reason)',
    async execute(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('You do not have permissions to use this command');

        let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
        if (!toMute) return message.channel.send('Couldn\'t find user.');
        if (toMute.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('Can\'t mute them!');
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
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        let mutetime = args[1];
        let reason = args[2];
        if (!parseInt(mutetime)) { mutetime = 'Permanent'; reason = args[1];}

        let muteEmbed = new Discord.MessageEmbed()
            .setDescription('~Mute~')
            .setColor('#fab132')
            .addField('Muted User', `${toMute} with ID ${toMute.id}`)
            .addField('Muted By', `<@${message.author.id}> with ID ${message.author.id}`)
            .addField('Muted In', `${message.channel}`)
            .addField('Muted For', `${mutetime}`)
            .addField('Tiime', `${message.createdAt}`)
            .addField('Reason', reason);

        let muteChannel = message.guild.channels.cache.find(c => c.name === logs);
        if (muteChannel) muteChannel.send(muteEmbed);

        await toMute.roles.add(muterole.id);
        message.channel.send(`<@${toMute.id}> has been muted for ${mutetime}`);

        if (parseInt(mutetime)) {
            setTimeout(() => {
                toMute.removeRole(muterole.id);
                message.channel.send(`<@${toMute.id}> has been unmuted!`);
            }, ms(mutetime));
        }
    },
};
