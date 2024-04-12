module.exports = {
    name: 'shuffle',
    aliases:'sf',
    execute(client,message){
        client.distube.shuffle(message)
        message.channel.send('Đã thay đổi thứ tự ưu tiên của các thuật thức')
    }
}