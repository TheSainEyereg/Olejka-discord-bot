const Discord = require("discord.js");
const axios = require('axios');

module.exports = {
	name: "coub",
	description: "Shows random 10s coub from  given community",
	arguments: "[community] (order: likes_count, views_count, newest_popular)",
	execute(message, args) {
		const communities = ["anime", "animals-pets", "blogging", "standup-jokes", "mashup", "movies", "gaming", "cartoons", "art", "live-pictures", "music", "news", "sports", "science-technology", "food-kitchen", "celebrity", "nature-travel", "fashion", "dance", "cars", "memes", /*"nsfw",*/ "featured", "coub-of-the-day"];
        const orders = ["likes_count", "views_count", "newest_popular"];
        if (!communities.includes(args[0]) || !args[0]) return message.channel.send(`Available communities: \`${communities.join(", ")}\``);
        order = orders.includes(args[1]);
        if (!order && args[1]) message.channel.send("Order is not correct, using default order.");
        const per_page = 25;
        axios.get(`https://coub.com/api/v2/timeline/community/${args[0]}/daily?per_page=${per_page}&order_by=${order ? args[1] : ""}`)
        .then(res => {
            const coubs = res.data.coubs;
            if (!coubs) return message.channel.send(`Error in getting coubs list!`);
            const coub = coubs[Math.floor(Math.random()*per_page)].id;
            if (!coub) return message.channel.send(`Error in getting coub info!`);
            axios.get(`https://coub.com/api/v2/coubs/${coub}`)
            .then(res => {
                const url = res.data.file_versions.share.default;
                const link = `https://coub.com/view/${res.data.permalink}`;
                if (!url || !link) return message.channel.send(`Error in getting video!`);
                const video = new Discord.MessageAttachment(url, "coub.mp4");
                message.channel.send(`\`${link}\``,video);
            })
            .catch(e => {
                return message.channel.send(`Error in fetching coub info: \`\`\`${e}\`\`\``);
            });
        })
        .catch(e => {
            return message.channel.send(`Error in fetching coubs list: \`\`\`${e}\`\`\``);
        });
	}
};