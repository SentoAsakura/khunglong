const { aliases } = require("./play");

module.exports = {
    name: 'queue',
    aliases: ['q'],
    execute(client, message, args, cmd){
        let queue = client.distube.getQueue(message.guild.id).songs
        let result = ``
        let i = 0
        console.log(queue)
        for(let q of queue){
            i++
            result += `${i}: ${q.name} \n`
        }
        message.channel.send(`\`\`\` \n ${result} \n \`\`\``)
    }
}