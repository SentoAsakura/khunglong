module.exports = {
    name: 'seek',
    execute(client, message, args, cmd){
        let guild = message.guild
        let time = parseInt(args[0])
        try{
            client.distube.seek(guild,time)
        }catch(err){
            console.log(err)
        }
    }
}