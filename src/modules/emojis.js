var logger = require('winston');

module.exports = function(bot, channelID, evt) {
	
	this.bot = bot;
	this.channelID = channelID;
	this.evt = evt;

	this.list = function() {
		var emojiArray = bot.servers[evt.d.guild_id].emojis;
		var formattedText = "";

		for(emoji in emojiArray) {
			if(!emojiArray[emoji].animated) {
				formattedText += "<:" + emojiArray[emoji].name + ":" + emojiArray[emoji].id + ">\n"
			} else {
				formattedText += "<a:" + emojiArray[emoji].name + ":" + emojiArray[emoji].id + ">\n"
			}
		}

		bot.sendMessage({
			to: channelID,
			message: formattedText
		});
	}
};