const mongoose = require('mongoose');
const fs = require('fs');
const Discord = require("discord.js");


const config = require("../config.json");
const PrefixSchema = require('../models/prefix');

module.exports = async (bot, message, guild) => {
    let prefix;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    const data = await PrefixSchema.findOne({
      GuildID: message.guild.id
  });
  if(data){
    prefix = data.Prefix;
  }
  else if (!data){
    prefix = "#";
  }

  

  if (message.content.startsWith(`<@${bot.user.id}>`) || message.content.startsWith(`<@!${bot.user.id}>`))   {
    let ramUsage = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + "MB";
    const embedBot = new Discord.MessageEmbed ()
    
      .setTitle(`Ola sou o Illumination`)
      .setDescription(`Se você me mencionou é porque esqueceu o prefixo ou é a minha primeira vez nesse Servidor`)
      .addFields(
        { name: "#️⃣Prefixo", value:  "```" + prefix + "```", inline: true },
        { name: "👩‍👩‍👧‍👧Guilds", value: "```" + bot.guilds.cache.size + "```", inline: true},
        { name: "🙍Users", value:  "```" + bot.users.cache.size + "```", inline: true },
        { name: "<:memory:810163895347445799>RAM usage", value:  "```" + ramUsage + "```", inline: true },
        { name: "<:latency:810165883946532896>API Latency", value:  "```" + bot.ws.ping + "```", inline: true },
        { name: "❓Para saber os comandos ou obeter ajuda use:", value:  "```" + `${prefix}help` + "```", inline: false},
        { name: "🛠️Built using", value:  "```" + `Node.js: V${process.versions.node}, Discord.js: V${Discord.version}, Mongose V${mongoose.version}` + "```", inline: false },
        
      )
      .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('FF007F')
      
       await message.channel.send(embedBot);
      }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
  
    if (cmd.length === 0) return;
    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));

    if (command) 
        command.run(bot, message, args);
  
};