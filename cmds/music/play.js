const { Util } = require('discord.js')
const config = require('../../config.json')
const scdl = require('soundcloud-downloader').default
const ytdl = require('ytdl-core')
const yts = require('yt-search')
const spdl = require('spdl-core');

module.exports = {
	name: 'play',
	description: 'Play command.',
	arguments: '[url]',
	async execute(message, args) {
		spdl.setCredentials(config.SPClient[0], config.SPClient[1])

		try{
			const { channel } = message.member.voice
			if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!')
			const permissions = channel.permissionsFor(message.client.user)
			if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!')
			if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!')
			if (!args) return message.channel.send('Any argument is missing!')
			const searchString = args.join(' ')
			const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''
	
			const serverQueue = message.client.queue.get(message.guild.id)
			let songInfo
			let song
			if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
				try {
					songInfo = await ytdl.getInfo(url)
					if (!songInfo) return message.channel.send('Looks like i was unable to find the song on YouTube', message.channel)
					song = {
						id: songInfo.videoDetails.videoId,
						title: songInfo.videoDetails.title,
						url: songInfo.videoDetails.video_url,
						img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
						duration: songInfo.videoDetails.lengthSeconds,
						ago: songInfo.videoDetails.publishDate,
						views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
						req: message.author,
					}
				} catch (error) {
					return message.channel.send(`Error at YTDL \`${error}\``)
				}
			} else if (url.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/gi)) {
				try {
					songInfo = await scdl.getInfo(url)
					if (!songInfo) return message.channel.send('Looks like i was unable to find the song on SoundCloud', message.channel)
					song = {
						id: songInfo.permalink,
						title: `${songInfo.title} (${songInfo.user.username})`,
						url: songInfo.permalink_url,
						img: songInfo.artwork_url,
						ago: songInfo.last_modified,
						views: String(songInfo.playback_count).padStart(10, ' '),
						duration: Math.ceil(songInfo.duration / 1000),
						req: message.author,
					};
				} catch (error) {
					return message.channel.send(`Error at SCDL \`${error}\``)
				}
			} else if (url.match(/^https?:\/\/(?:open|play)\.spotify\.com\/track/gi)) { //https://open.spotify.com/track/5GRf6zSrCi8gErdN6CyRJT?si=21cb6809ecff4a47
				try {
					songInfo = await spdl.getInfo(url)
					if (!songInfo) return message.channel.send('Looks like i was unable to find the song on Spotify', message.channel)
					song = {
						id: songInfo.id,
						title: `${songInfo.title} (${songInfo.artists.join(', ')})`,
						url: songInfo.url,
						img: songInfo.preview_url,
						ago: undefined, //How the fuck can I know?
						views: undefined, //-_-
						duration: Math.ceil(songInfo.duration / 1000),
						req: message.author,
					}
				} catch (error) {
					return message.channel.send(`Error at SPDL \`${error}\``)
				}
			} else {
				try {
					var searched = await yts.search(searchString);
					if (searched.videos.length === 0) return message.channel.send('Looks like i was unable to find the song on YouTube', message.channel);
	
					songInfo = searched.videos[0]
					song = {
						id: songInfo.videoId,
						title: Util.escapeMarkdown(songInfo.title),
						views: String(songInfo.views).padStart(10, ' '),
						url: songInfo.url,
						ago: songInfo.ago,
						duration: songInfo.duration.toString(),
						img: songInfo.image,
						req: message.author,
					};
				} catch (error) {
					return message.channel.send(`Error at YTS \`${error}\``)
				}
			}
	
	
			if (serverQueue) {
				serverQueue.songs.push(song);
				//console.log(serverQueue.songs);
				return message.channel.send(`**${song.title}** has been added to the queue!`)
			}
	
			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: channel,
				connection: null,
				songs: [],
				volume: 75,
				playing: true
			}
			message.client.queue.set(message.guild.id, queueConstruct)
			queueConstruct.songs.push(song)
	
			const play = async (song) => {
				const queue = message.client.queue.get(message.guild.id)
				if (!song) {
					message.guild.me.voice.channel.leave()
					message.client.queue.delete(message.guild.id)
					return
				}
				let stream
				let streamType
	
				try {
					if (song.url.includes('soundcloud.com')) {
						try {
							stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, config.SCClient);
						} catch (error) {
							stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, config.SCClient);
							streamType = 'unknown'
						}
					} else if (song.url.includes('youtube.com')) {
						stream = await ytdl(song.url, { quality: 'highestaudio', highWaterMark: 1 << 25, type: 'opus' });
						stream.on('error', e => {
							if (e) {
								if (queue) {
									queue.songs.shift()
									play(queue.songs[0])
									return message.channel.send(`An unexpected error has occurred.\nPossible type \`${e}\``, message.channel)
								}
							}
						});
					} else if (song.url.includes('spotify.com')) {
						stream = await spdl(song.url)
						stream.on('error', e => {
							if (e) {
								if (queue) {
									queue.songs.shift()
									play(queue.songs[0])
									return message.channel.send(`An unexpected error has occurred.\nPossible type \`${e}\``, message.channel)
								}
							}
						})
					}
				} catch (error) {
					message.channel.send(`Error at song playing algorytm \`${error}\``)
					if (queue) {
						queue.songs.shift()
						play(queue.songs[0])
					}
				}
				queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id))
				const dispatcher = queue.connection.play(stream).on('finish', () => {
					const shiffed = queue.songs.shift()
					if (queue.loop === true) {
						queue.songs.push(shiffed)
					}
					play(queue.songs[0])
				})
	
				dispatcher.setVolumeLogarithmic(queue.volume / 100)
				message.channel.send(`Started playing **${song.title}**! \n\`Rquired by ${song.req.tag}\``)
			};
	
			try {
				const connection = await channel.join()
				queueConstruct.connection = connection
				play(queueConstruct.songs[0])
			} catch (error) {
				console.error(`I could not join the voice channel: ${error}`)
				message.client.queue.delete(message.guild.id)
				await channel.leave()
				return message.channel.send(`I could not join the voice channel: ${error}`)
			}
		} catch(e) {
			message.channel.send(`Async error occured!\n\`\`\`${e}\`\`\``)
		}
	}
};
