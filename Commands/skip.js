module.exports = {
    name: 'skip',
    aliases: ['s'],
    execute(client, message, args, cmd){
        try{

            client.distube.skip(message)
            message.channel.send('Đã bỏ qua 1 lần xoay')
        }catch(err){
            console.log(err)
        }
    }
}