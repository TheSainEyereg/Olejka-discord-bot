const config = require('../../config.json')
const fs = require('fs');
const { exec } = require("child_process");

module.exports = {
	name: 'update',
	description: 'Checking for bot update',
	arguments: '',
	execute(message, args) {
        if (message.author.id != config.creatorid) return message.channel.send(`You are not creator of this bot`)
        exec("git pull", (error, stdout, stderr) => {
            if (error) return message.channel.send(`Error in execute: ${error.message}`)
            //if (stderr) return message.channel.send(`Error in update check: ${stderr}`)
            if (stdout == `Already up to date.\n`) return message.channel.send(`You already up to date.`)
            message.channel.send(`Update found. Reloading commands...`)
            
            const cmddir = fs.readdirSync(`./${config.cmddir}`);
            for (let dir in cmddir) {
                let files = fs.readdirSync(`./${config.cmddir}/${cmddir[dir]}`);
                for (let file in files){
                    delete require.cache[require.resolve(`../${cmddir[dir]}/${files[file]}`)];

                    try {
                        const newCommand = require(`../${cmddir[dir]}/${files[file]}`);
                        message.client.commands.set(newCommand.name, newCommand);
                    } catch (error) {
                        return message.channel.send(`Error in ${files[file]} reload: \`${error.message}\``)
                    }
                }
            }
            message.channel.send(`Successfully reloaded all commands!`)
        });
	}
};