var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../auth.json');

// Imported modules
const deckModule = require("./modules/deck");
const posiModule = require("./modules/positive");
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

// When the bot starts
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// TODO: change the evt.d.member.roles to check the userId object instead??
// TODO: add a bad words detector
// TODO: abstract these cases into their own modules
bot.on('message', function (user, userID, channelID, message, evt) {
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
		
        args = args.splice(1);
        switch(cmd) {
			// !ban
			case 'ban':
				// Hardcoded to my role in my personal server, can be changed to a saved list if actually widespread implemented
				if(evt.d.member.roles.indexOf('542037761310588928') === -1) {
					return bot.sendMessage({
						to: channelID,
						message: 'You cannot use that!'
					});
				} else {
					// Gets the first mentioned user only (TODO: change this to the ability to iterate through a list of mentions)
					var mentionedUser = evt.d.mentions[0];
					// Bans the user that has been mentioned
					bot.ban({
						serverID: '541477489369677824',
						userID: mentionedUser.id
					});
					// Sends a message saying they were banned
					bot.sendMessage({
						to: channelID,
						message: 'Banned ' + mentionedUser.username + ' from the server!'
					});
				}
				break;
			// !deck
			case 'deck':
				// Simply goes to the module and looks for the name in the function's switch statement
				var deckLink = deckModule.deckName(args[0]);
				bot.sendMessage({
					to: channelID,
					message: deckLink
				});
				break;
			// !kick
			case 'kick':
				// Hardcoded to my role in my personal server, can be changed to a saved list if actually widespread implemented
				if(evt.d.member.roles.indexOf('542037761310588928') === -1) {
					return bot.sendMessage({
						to: channelID,
						message: 'You cannot use that!'
					});
				} else {
					var mentionedUser = evt.d.mentions[0];
					// Kicks the user
					bot.kick({
						serverID: '541477489369677824',
						userID: mentionedUser.id
					});
					// Sends a message saying they were kicked
					bot.sendMessage({
						to: channelID,
						message: 'Kicked ' + mentionedUser.username + ' from the server!'
					});
				}
				break;
			// !posi
			case 'posi':
				var posiSize = positive.length;
				// The random number in the array of positive messages
				var positiveMessage = positive[Math.floor(Math.random() * posiSize)]
				bot.sendMessage({
					to: channelID,
					message: positiveMessage
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
