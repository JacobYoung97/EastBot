module.exports = {	
	deckName: function(name) {
		var decks = [
			"https://www.mtggoldfish.com/deck/1590041", // Slimefoot
			"https://www.mtggoldfish.com/deck/1590123", // Aryel
			"https://www.mtggoldfish.com/deck/1590156", // Hallar
			"https://www.mtggoldfish.com/deck/1591752", // Adeliz
			"https://www.mtggoldfish.com/deck/1604939", // Traxos
			"https://www.mtggoldfish.com/deck/1609908", // Kazarov
			"https://www.mtggoldfish.com/deck/1607716", // Shanna
			"https://www.mtggoldfish.com/deck/1642808", // Raff
			"https://www.mtggoldfish.com/deck/1652833" // Tatyova
		];
		switch (name.toUpperCase()) {
			case "SLIMEFOOT":
				return "Slimefoot, the Stowaway: " + decks[0]
			break;
			case "ARYEL":
				return "Aryel, Knight of Windgrace: " + decks[1];
			break;
			case "HALLAR":
				return "Hallar, the Firefletcher: " + decks[2];
			break;
			case "ADELIZ":
				return "Adeliz, the Cinder Wind: " + decks[3];
			break;
			case "TRAXOS":
				return "Traxos, Scourge of Kroog: " + decks[4];
			break;
			case "KAZAROV":
				return "Kazarov, Sengir Pureblood: " + decks[5];
			break;
			case "SHANNA":
				return "Shanna, Sisay's Legacy: " + decks[6];
			break;
			case "RAFF":
				return "Raff Capashen, Ship's Mage: " + decks[7];
			break;
			case "TATYOVA":
				return "Tatyova, Benthic Druid: " + decks[8];
			break;
			default:
				return "That is not an available deck.";
			break;
		}
	}
};