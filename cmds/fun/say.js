module.exports = {
	name: "say",
	description: "Repeat given word",
	arguments: "[word to say]",
	execute(message, args) {
		if (!args[0]) return message.channel.send("Nothing to say");
		let out = args.join(" ")
		const re = /@|.:\/\/|https:\/\/|http:\/\/|ftp:\/\//gi
		while (out.match(re)) out = out.replace(re,"");
		if (!out) return message.channel.send("Can\"t send empty message!");
        message.channel.send(out);
	}
};