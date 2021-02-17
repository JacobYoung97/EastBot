var logger = require('winston');

module.exports = function(bot, channelID, evt) {
	
	this.bot = bot;
	this.channelID = channelID;
	this.evt = evt;
}