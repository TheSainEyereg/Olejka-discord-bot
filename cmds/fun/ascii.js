const axios = require('axios');

module.exports = {
	name: "ascii",
	description: "Makes ascii art",
	arguments: "[words to ascii]",
	execute(message, args) {
		if (!args[0]) return message.channel.send("Nothing to convert");
        axios.get(`https://artii.herokuapp.com/make?text=${args.join(" ")}`)
        .then(res => {
            message.channel.send(`\`\`\`${res.data}\`\`\``);
        })
        .catch(e => {
            return message.channel.send(`Error in ascii converting: \`\`\`${e}\`\`\``);
        });
	}
};