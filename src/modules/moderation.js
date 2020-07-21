var logger = require('winston');

module.exports = function(bot, channelID, evt) {

    this.bot = bot;
    this.channelID = channelID;
    this.evt = evt;

    this.moderator = function(action) {
        // They have moderation permissions
        if(this.hasPermissions(this.evt.d.member)) {
            // Gets the first mentioned user only (TODO: update to iterate through a list of users)
            var mentionedUser = this.evt.d.mentions[0];
            switch(action) {
                case 'ban':
                    this.ban(mentionedUser.id);
                    // Sends a message saying they were banned
                    this.sender('Banned **' + mentionedUser.username + '** from the server!');
                    break;
                case 'kick':
                    this.kick(mentionedUser.id);
                    // Sends a message saying they were kicked
                    this.sender('Kicked **' + mentionedUser.username + '** from the server!');
                    break;
            }
        } else {
            this.sender("You cannot use that command!");
        }
    }

    this.ban = function(userID) {
        // Bans the user that has been mentioned
        this.bot.ban({
            serverID: this.evt.d.guild_id,
            userID: userID
        });
    }

    this.kick = function(userID) {
        // Kicks the user that has been mentioned
        this.bot.kick({
            serverID: this.evt.d.guild_id,
            userID: userID
        });
    }

    // Checks if they have permissions to use these commands
    this.hasPermissions = function(user) {
        // Hardcoded to my role in my personal server, can be changed to a saved list if actually widespread implemented
        if(user.roles.indexOf('542037761310588928') == -1) {
            return false;
        }
        return true;
    }

    // Sends the message to the server
    this.sender = function(text) {
        this.bot.sendMessage({
            to: this.channelID,
            message: text
        });
    }
};