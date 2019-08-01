const Discord = require("discord.js");
const YTDL = require('ytdl-core');
const Bot = new Discord.Client();
const config = require('./config.json');

Bot.login(config.token);

Bot.on('ready', () => {
    console.log('\x1b[1m\x1b[31mMusicBoi\x1b[0m is \x1b[32mOnline !!!')
})

Bot.on('message', message => {
    if(message.author.bot) return;
    let messageArray = message.content.split(" ");
    let p = config.prefix;

    function play(connection,message) {
        var server = servers[message.guild.id];
        server.dispatcher = connection.playStream(YTDL(server.queue[0],{filter: "audioonly"}));
        server.queue.shift();
        server.dispatcher.on('end', function() {
            if(server.queue[0]) play(connection,message);
            else connection.disconnect();
        });
    }

    var servers = {};

    // If User types -play
    if (messageArray[0] == `${p}play` && !messageArray[1]) {      
        message.channel.send('Please provide the Song');
        return;
    }

    // If User types -play <LINK> But Forgets to Join Voice Channel
    if(messageArray[0] == `${p}play` && messageArray[1] && !message.member.voiceChannel) {
        message.channel.send('Join a Voice Channel');   
        return;
    }

    if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    };

    var server = servers[message.guild.id];
    server.queue.push(messageArray[1]);
    if(messageArray[0] == `${p}play` && messageArray[1] && !message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
        play(connection,message);    
    });

    // -dc      to disconnect the bot
    if(messageArray[0] == `${p}dc` && !message.author.bot) {
        var server = servers[message.guild.id];
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }
})