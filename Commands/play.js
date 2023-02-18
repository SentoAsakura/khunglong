const ytdl = require('ytdl-core-discord')
const ytSearch = require('yt-search')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, NoSubscriberBehavior, StreamType } = require('@discordjs/voice')
const player = createAudioPlayer()

const queue = new Map()
// queue(message.guild.id, queue_constuctor object {voice channel, text channel, connection, song[]})
module.exports = {
    name: 'play',
    aliases: ['skip', 'stop'],
    cooldown: 0,
    async execute(message, args, cmd) {

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('Chú cần vào 1 channel để dùng lệnh này')
        const permissions = voice_channel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('Pri không có quyền đấy')

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play') {
            if (!args.length) return message.channel.send('**CHÚ MÀY THÊM CÁI LINK HOẶC TỪ KHÓA HỘ CÁI**')
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //If the video is not a URL then use keywords to find that video.
                const video_finder = async (query) => {
                    const videoResults = await ytSearch(query);
                    return (videoResults.videos.length > 1) ? videoResults.videos[0] : null
                }

                const video = await video_finder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url }
                } else {
                    message.channel.send('Không thể tìm thấy video');
                }
            }

            if (!server_queue) {

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }

                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);

                try {
                    queue_constructor.connection = await joinVoiceChannel({
                        channelId: voice_channel.id,
                        guildId: voice_channel.guild.id,
                        adapterCreator: voice_channel.guild.voiceAdapterCreator,
                    })
                    await video_player(message.guild, queue_constructor.songs.shift())
                    player.on(AudioPlayerStatus.Idle, () => {
                        video_player(message.guild, queue_constructor.songs.shift());
                    });
                } catch (err) {
                    queue.delete(message.guild.id)
                    message.channel.send('Bruh')
                    throw err;
                }
            } else {
                server_queue.songs.push(song)
                return message.channel.send(`\`${song.title}\`đã được thêm vào hàng chờ`)
            }
        }

        else if (cmd === 'skip') await skipSong(message, server_queue)
        else if (cmd === 'stop') await stop_song(message, server_queue)
    }
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id)

    if (!song) {
        await song_queue.connection.destroy();
        queue.delete(guild.id)
        return;
    }

    const stream = await ytdl(song.url, {
        filter: "audioonly",
        fmt: "mp3",
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0, //disabling chunking is recommended in discord bot
        bitrate: 128,
        quality: "lowestaudio",
    });
    song_queue.connection.subscribe(player)
    song_queue.connection.on(VoiceConnectionStatus.Destroyed, () => {
        queue.delete(guild.id)
    })
    const resource = createAudioResource(stream)
    player.play(resource)
    player.on('error', (err) => {
        console.log(err)
    })
    await song_queue.text_channel.send(`Đang phát \`${song.title}\``)
}

const skipSong = async (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('Chú cần vào 1 channel để dùng lệnh này')
    if (!server_queue) return message.channel.send('Hàng chờ như số nyc của Dilo ấy <:lmao:951394931535130694>')
    player.stop()
    await video_player(message.guild, server_queue.songs.shift())
}

const stop_song = async (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('Chú cần vào 1 channel để dùng lệnh này')
    await server_queue.connection.destroy();
    server_queue = null
}