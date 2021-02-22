const ms = require("ms");
const logs = require("../../config.json").logs;

module.exports = {
    name: "mute",
    description: "Mutes member on server",
    arguments: "[user] (duration (mins)) (reason)",
    async execute(message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("You do not have permissions to use this command");

        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
        if (!tomute) return message.channel.send("Couldn't find user.");
        if (tomute.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("Can't mute them!");
        let muterole = message.guild.roles.find(`name`, "Muted");
        if (!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: "Muted",
                    color: "#000000",
                    permissions: [],
                });
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
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
        if (!parseInt(mutetime)) { mutetime = "Permanent"; reason = args[1];}

        let muteEmbed = new Discord.RichEmbed()
            .setDescription("~Mute~")
            .setColor("#e56b00")
            .addField("Muted User", `${tomute} with ID ${tomute.id}`)
            .addField("Muted By", `<@${message.author.id}> with ID ${message.author.id}`)
            .addField("Muted In", `${message.channel}`)
            .addField("Muted For", `${mutetime}`)
            .addField("Tiime", `${message.createdAt}`)
            .addField("Reason", reason);

        let muteChannel = message.guild.channels.find(`name`, logs);
        if (muteChannel) muteChannel.send(muteEmbed);

        await tomute.addRole(muterole.id);
        message.channel.send(`<@${tomute.id}> has been muted for ${mutetime}`);

        if (parseInt(mutetime)) {
            setTimeout(() => {
                tomute.removeRole(muterole.id);
                message.channel.send(`<@${tomute.id}> has been unmuted!`);
            }, ms(mutetime));
        }
    },
};
