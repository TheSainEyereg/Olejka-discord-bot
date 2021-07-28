# Olejka discord bot
 My first discord bot

## Instruction
To run this bot yourself:
1. Install NodeJS 15 or higher (LTS 16.5.0 is recommended)
2. Clone and install dependencies
```
git clone https://github.com/TheSainEyereg/Olejka-discord-bot.git
cd Olejka-discord-bot
npm i
```
3. Create `config.json` file with this lines: 
```
{
    "token": "YOUR_BOT_TOKEN",
    "prefix": "o!",
    "cmddir": "cmds",
    "logs": "bot-logs",
    "cooldown": 5,
    "updateInterval": 300,
    "creatorid": "YOUR_DISCORD_ID",
    "YTClient": "YOUTUBE_API_KEY",
    "SCClient": "SOUNDCLOUD_API_KEY",
    "SPClient": ["SPOTIFY_APP_ID", "SPOTIFY_APP_SECRET"]
}
```
4. Run bot by typing `npm start` or `node index.js`

## Commands
You can view command list by typing `o!help` or list the `cmds/` directory  
Also you can add your own command by putting it in `cmds/` dir
