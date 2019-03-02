var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Imported modules
const posiModule = require("./positive");
const deckModule = require("./deck");
let positive = posiModule.positiveArray();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
		
        args = args.splice(1);
        switch(cmd) {
			// !ban
			case 'ban':
				if(evt.d.member.roles.indexOf('542037761310588928') === -1)
					return bot.sendMessage({
						to: channelID,
						message: 'You cannot use that!'
					});
				// Bans the user
				bot.ban({
					serverID: '541477489369677824',
					userID: evt.d.mentions[0].id
				});
				// Sends a message saying they were kicked
				bot.sendMessage({
					to: channelID,
					message: 'Banned ' + evt.d.mentions[0].username + ' from the server!'
				});
			break;
			// !deck
			case 'deck':
				var message = deckModule.deckName(args[0]);
				bot.sendMessage({
					to: channelID,
					message: message
				});
			break;
			// !kick
			case 'kick':
				if(evt.d.member.roles.indexOf('542037761310588928') === -1)
					return bot.sendMessage({
						to: channelID,
						message: 'You cannot use that!'
					});
				// Kicks the user
				bot.kick({
					serverID: '541477489369677824',
					userID: evt.d.mentions[0].id
				});
				// Sends a message saying they were kicked
				bot.sendMessage({
					to: channelID,
					message: 'Kicked ' + evt.d.mentions[0].username + ' from the server!'
				});
			break;
			// !posi
			case 'posi':
				bot.sendMessage({
					to: channelID,
					message: positive[Math.floor(Math.random() * positive.length)]
				});
			break;
			// !say
			case 'say':
				const saidMsg = args.join(" ");
				// Deletes the message before sending it
				bot.deleteMessage({
					channelID: channelID,
					messageID: evt.d.id
				});
				bot.sendMessage({
					to: channelID,
					message: saidMsg
				});
			break;
        }
    }
});