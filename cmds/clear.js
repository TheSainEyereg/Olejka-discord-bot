module.exports = {
    name: 'clear',
    description: 'Clears messages count',
    execute(message, args) {
        if (!mess.member.hasPermission('MANAGE_MESSAGES')) return mess.channel.send('You have no permission to remove messages');
        const amount = args[0]
        if (!amount)
            return message.channel.send('No amount given')
        if (isNaN(amount)) return message.channel.send('That is not a number -_-')
        if (amount > 100)
            return message.channel.send('Looks like you are going to remove too many messages O_O');
        if (amount < 1)
            return message.channel.send('You can remove 1 message by yourself');
        async function delete_messages() {
            await message.channel.messages
                .fetch({
                    limit: amount,
                })
                .then((messages) => {
                    message.channel.bulkDelete(messages);
                    message.channel.send(`Deleted ${amount} messages!`);
                });
        }
        delete_messages();
    },
};
