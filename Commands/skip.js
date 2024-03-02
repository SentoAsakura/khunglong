module.exports = {
    name: 'skip',
    aliases: ['s'],
    execute(client, message, args, cmd){
        let queue = client.distube.getQueue(message.guild.id)
        if(queue.songs.length > 1){
            client.distube.skip(message)
        }else{
            client.distube.stop(message)
        }
        message.channel.send('Đã bỏ qua 1 lần xoay')
    }
}