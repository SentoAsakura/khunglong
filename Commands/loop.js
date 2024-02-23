module.exports = {
    name: 'loop',
    aliases: ['lcp'],
    execute(client, message,args){
        let mode = 1
        
        if(args[0] == 'queue'){
            mode = 2
        }
        let currentMode = client.distube.setRepeatMode(message,mode)
        let result
        switch(currentMode){
            case 1:
                result = 'Thuật thức quá khó thích nghi, đang tìm nhiều cách đối phó hơn'
                break
            case 2:
                result = 'Quá nhiều thuật thức khó thích nghi, đang tìm cách đối phó với từng thuật thức'
                break
            case 0:
                result = 'Đã ngưng tim cách đối phó với thuật thức'
        }
        message.channel.send(result)

    },
}