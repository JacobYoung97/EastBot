var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../auth.json');

// Imported modules
const covidModule = require("./modules/covid");
const deckModule = require("./modules/deck");
const moderationModule = require("./modules/moderation");
const emojiModule = require("./modules/emojis");
const posiModule = require("./modules/positive");
const games = require("./modules/playing");

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
    var name = games[Math.floor(Math.random() * games.length)];
    var type = 0;
    var url = "";

    // Sets a status 
    bot.setPresence({
        game: {
            name,
            type,
            url
        }
    });
});

// TODO: add a bad words detector
bot.on('message', function (user, userID, channelID, message, evt) {
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var moderation = new moderationModule(bot, channelID, evt);
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        switch(cmd) {
            // !ban
            case 'ban':
                moderation.moderator(cmd);
                break;
            // !covid
            case 'covid':
                var covidFunction = new covidModule(bot, channelID);
                // A state in the United States is going to be searched (second check is to avoid "State of Palestine" from searching here)
                if (args.length >= 2 && args[0].toLowerCase().localeCompare("state") == 0 && args[1].toLowerCase().localeCompare("of") != 0) {
                    covidFunction.casesByState(args).then(function(message) {
                        covidFunction.sender(message);
                    });
                }
                // A country is given
                else if (args.length >= 1) {
                    covidFunction.casesByCountry(args).then(function(message) {
                        covidFunction.sender(message);
                    });
                }
                break;
            // !deck
            case 'deck':
                // Simply goes to the module and looks for the name in the function's switch statement
                bot.sendMessage({
                    to: channelID,
                    message: deckModule.deckName(args[0])
                });
                break;
			// !emojis
			case 'emojis':
				var emojis = new emojiModule(bot, channelID, evt);
				emojis.list();
				break;
            // !game
            case 'game':
                // Since -1 is not an index of an array, this will default to what they say
                var index = parseInt(args[0]) || -1;
                var name = games[index];
                // If the name is undefined, use what they said instead
                if (name == undefined) {
                    name = args.join(" ");
                }
                var message = "I am now playing " + name;
                var type = 0;
                var url = "";
                // Sets the game they are playing
                bot.setPresence({
                    game: {
                        name,
                        type,
                        url
                    }
                });
                // Updates on what they are playing
                bot.sendMessage({
                    to: channelID,
                    message: message
                });
                break;
            // !kick
            case 'kick':
                moderation.moderator(cmd);
                break;
            // !obeyme
            case 'obeyme':
                // Says the username of the person who interacted with it
                bot.sendMessage({
                    to: channelID,
                    message: 'fine.....grrrr ' + user,
                    tts: true
                })
                break;
            // !posi
            case 'posi':
                // The random number in the array of positive messages
                bot.sendMessage({
                    to: channelID,
                    message: posiModule[Math.floor(Math.random() * posiModule.length)]
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
                // Now the bot types it
                bot.sendMessage({
                    to: channelID,
                    message: saidMsg,
                    typing: true
                });
                break;
        }
    }
});
