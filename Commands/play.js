const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, NoSubscriberBehavior, StreamType } = require('@discordjs/voice')
const player = createAudioPlayer()

module.exports = {
    name: 'play',
    aliases: ['p'],
    execute(client,message,args,cmd){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('Chú cần vào 1 channel để dùng lệnh này')
        const permissions = voice_channel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('Pri không có quyền đấy')

        player.on('connectionCreate', (queue) => {
            queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
              const oldNetworking = Reflect.get(oldState, 'networking');
              const newNetworking = Reflect.get(newState, 'networking');
        
              const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                const newUdp = Reflect.get(newNetworkState, 'udp');
                clearInterval(newUdp?.keepAliveInterval);
              }
        
              oldNetworking?.off('stateChange', networkStateChangeHandler);
              newNetworking?.on('stateChange', networkStateChangeHandler);
            });
        });

        client.distube.voices.join(voice_channel)
        let x = args.join(' ')
        if(!x){
            message.channel.send('K.Y.S')
        }
        
        try{
            client.distube.play(voice_channel, x,{
                member: message.member,
                textChannel: message.channel,
                message
            })
        } catch(err){
            console.log(err)
        }
        
        
        
        
    }
}