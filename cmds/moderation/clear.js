module.exports = {
    name: 'clear',
    description: 'Clears messages count',
	arguments: '[count]',
    execute(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.hasPermission('ADMINISTRATOR')) {
                const mods = require('../../servers.json')[message.guild.id].moders
                if (!mods.includes(message.author.id)) return message.channel.send('You do not have permissions to use this command')
        }
        if (!args[0]) return message.channel.send('No amount given')
        const amount = parseInt(args[0])+1 //For command message
        if (isNaN(amount)) return message.channel.send('That is not a number -_-')
        if (amount > 100)
            return message.channel.send('Looks like you are going to remove too much messages O_O')
        if (amount < 1)
            return message.channel.send('You can remove 1 message by yourself');
        async function delete_messages() {
            await message.channel.messages
                .fetch({
                    limit: amount,
                })
                .then((messages) => {
                    message.channel.bulkDelete(messages)
                        .then(_ => {
                            message.channel.send(`Deleted ${amount-1} messages!`) //For command message
                            .then(msg => {
                                msg.delete({timeout: 3000})
                            })
                            .catch(/*e => {messgae.channel.send('Error when deleting message')}*/)
                        })
                        .catch(e => {return message.channel.send(`Oh no: \`${e}\``)});
                });
        }
        delete_messages()
    },
};
