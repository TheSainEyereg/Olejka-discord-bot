# ⚠This repo is now archived and no longer maintained
This was my first discord bot that was used on some of my servers. But now I'm closing this.  

**Several reasons:**  
* Bad code structure.  
* Bad files structure.  
* bad style.
* Unstable/Unoptimised functionality.  
* Many pasted code.  

I will continue fixing critical errors or shortcomings of this bot, but not for a long time.

---

### I'm going to rewrite some of this functions in my new bot project called [ZeroBot](https://github.com/TheSainEyereg/ZeroBot-Discord)  
When this is completed, it will become my main project of this type that I will develop.

---
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

---
If you have any troubles on Linux machines with Canvas or another lib, try installing these dependencies:
```sh
sudo apt-get update 
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm i #or npm i canvas
```
---

## Commands
You can view command list by typing `o!help` or list the `cmds/` directory  
Also you can add your own command by putting it in `cmds/` dir
