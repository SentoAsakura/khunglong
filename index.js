const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});
const config = require('./Utility/setting.json');
const PREFIX = config.PREFIX
const { DisTube } = require('distube')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  client.commands.set(command.name, command);
}

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emptyCooldown: 300,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false
})

client.on("messageCreate", message =>{
    if(message.content === 'Với kho báu này, ta triệu hồi'){
      message.reply('Có con cặc')
    }
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;  
    const args = message.content.slice(PREFIX.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))
    if (!command) return;
    if(command) command.execute(client,message, args, cmd)
})
client.on('ready', ()=>{
  console.log('With this treasure, I summon \n Eight-Handled Sword Divergent Sila Divine General Mahoraga')
})
  
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());


client.login(config.TOKEN)