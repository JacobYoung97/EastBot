var covid = require('covid19-api');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../auth.json');

// Imported modules
const deckModule = require("./modules/deck");
var posiModule = require("./modules/positive");
var games = require("./modules/playing");

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
            // !covid
            case 'covid':
                // A state in the United States is going to be searched (second check is to avoid "State of Palestine" from searching here)
                // https://www.npmjs.com/package/covid19-api#pluginmanagergetcasesinallusstates for the US states info
                if (args.length >= 2 && args[0].toLowerCase().localeCompare("state") == 0 && args[1].toLowerCase().localeCompare("of") != 0) {
                    // Retrieves the information from all United States
                    covid.getCasesInAllUSStates().then(function(stats) {
                        var stateArray = stats[0][0]["table"];
                        var name = "";
                        
                        // This loop will make the name look nice (and to compare to the returned array's value)
                        for(var i = 1; i < args.length; i++) {
                            var temp = args[i][0].toUpperCase() + args[i].substring(1).toLowerCase();
                            name += temp + " ";
                        }
                        name = name.trim();
                        
                        // Loops through the returned values (64 of them) to check the state name for equality
                        for(var i = 0; i < stateArray.length; i++) {
                            if (stateArray[i]["USAState"].localeCompare(name) == 0) {
                                var messageContent = '**' + stateArray[i]["USAState"] + ': COVID-19 Cases**' +
                                    '\nTotal Cases: ' + stateArray[i]["TotalCases"] +
                                    '\nTotal Deaths: ' + stateArray[i]["TotalDeaths"] +
                                    '\nCases per 100,000: ' + parseFloat(stateArray[i]["Tot_Cases_1M_Pop"].replace(/,/g, ''))/10 +
                                    '\nTested: ' + stateArray[i]["TotalTests"];
                                bot.sendMessage({
                                    to: channelID,
                                    message: messageContent
                                });
                            }
                        }
                    });
                }
                // A country is given (https://www.npmjs.com/package/covid19-api#pluginmanagergetreportsbycountriescountry for the name/syntax of each country)
                else if (args.length >= 1) {
                    var country = args.join("-");
                    var name = "";
                    
                    // This loop will make the name look nice (capitalizes the first letter and appends words together)
                    for(var i = 0; i < args.length; i++) {
                        var temp = args[i][0].toUpperCase() + args[i].substring(1).toLowerCase();
                        name += temp + " ";
                    }
                    name = name.trim();
                    
                    // Retrieves the information by country and either posts it, or has an error because the country does not exist
                    covid.getReportsByCountries(country).then(function(stats) {
                        bot.sendMessage({
                           to: channelID,
                           message: '**' + name + ': COVID-19 Cases**\nTotal Cases: ' + stats[0][0]["cases"] + '\nTotal Deaths: ' + stats[0][0]["deaths"]
                        });
                    }).catch(function(error) {
                        bot.sendMessage({
                           to: channelID,
                           message: '**' + name + '** is not a country! Cannot retrieve data from a nonexistent country!'
                        });
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
                        message: 'Kicked ' + mentionedUser.username + ' from the server!',
                    });
                }
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
            // !obeyme
            case 'obeyme':
                // Says the username of the person who interacted with it
                bot.sendMessage({
                    to: channelID,
                    message: 'fine.....grrrr ' + user,
                    tts: true
                })
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
        }
    }
});
