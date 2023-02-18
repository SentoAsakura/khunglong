const keep = require('./keep')
const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});
const config = require('./Utility/setting.json');
const PREFIX = config.PREFIX

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", message =>{
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;  
    const args = message.content.slice(PREFIX.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))
    if (!command) return;
    if(command) command.execute(message, args, cmd)
})
client.on('ready', ()=>{
    console.log('Get ready for boost and Magnum \n  Ready \n        Fight')
    keep()
})
  

client.login(config.TOKEN)