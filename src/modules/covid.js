var covid = require('covid19-api');
var logger = require('winston');

module.exports = function(bot, channelID) {
    
    this.bot = bot;
    this.channelID = channelID;

    // https://www.npmjs.com/package/covid19-api#pluginmanagergetcasesinallusstates for the states info
    this.casesByState = function(state) {
        // Retrieves the information from all United States
        return covid.getCasesInAllUSStates().then(function(stats) {
            var stateArray = stats[0][0]["table"];
            var name = "";
            
            // This loop will make the name look nice (and to compare to the returned array's value)
            for(var i = 1; i < state.length; i++) {
                var temp = state[i][0].toUpperCase() + state[i].substring(1).toLowerCase();
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
                    return messageContent;
                }
            }
        });
    }
    
    // Refer to https://www.npmjs.com/package/covid19-api#pluginmanagergetreportsbycountriescountry for the name/syntax of each country
    this.casesByCountry = function(country) {
        var countrySyntax = country.join("-");
        var name = "";
        
        // This loop will make the name look nice (capitalizes the first letter and appends words together)
        for(var i = 0; i < country.length; i++) {
            var temp = country[i][0].toUpperCase() + country[i].substring(1).toLowerCase();
            name += temp + " ";
        }
        name = name.trim();
        
        // Retrieves the information by country and either posts it, or has an error because the country does not exist
        return covid.getReportsByCountries(countrySyntax).then(function(stats) {
            return '**' + name + ': COVID-19 Cases**\nTotal Cases: ' + stats[0][0]["cases"] + '\nTotal Deaths: ' + stats[0][0]["deaths"];
        }).catch(function(error) {
            return '**' + name + '** is not a country! Cannot retrieve data from a nonexistent country!';
        });
    }
    
    // Sends the message to the server
    this.sender = function(text) {
        bot.sendMessage({
            to: channelID,
            message: text
        });
    }
}