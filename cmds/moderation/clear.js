module.exports = {
    name: 'clear',
    description: 'Clears messages count',
	arguments: '[count]',
    execute(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES') || !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You have no permission to remove messages');
        if (!args[0]) return message.channel.send('No amount given')
        const amount = parseInt(args[0])+1 //For command message
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
                    message.channel.send(`Deleted ${amount-1} messages!`) //For command message
                    .then(msg => {
                        msg.delete({timeout: 3000})
                    })
                    .catch(/*e => {messgae.channel.send('Error when deleting message')}*/);
                });
        }
        delete_messages();
    },
};
