module.exports = {
    name: 'stop',
    execute(client, message,args){
        client.distube.stop(message)
    }
}