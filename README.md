# EastBot

A simple bot I am creating for Discord. Will start with a randomly selected game that is is playing. This can be changed with the "!game" command that the bot has.

# Commands

## !ban {mentioned user}
  This will ban the mentioned user from the server. Only works for admins/mods.

## !deck {creature name}
  This will send a link to a deck from MTGGoldfish.
  
## !kick {mentioned user}
  This wil kick the mentioned user from the server. Only works for admins/mods.

## !posi
  This command returns a random positive message from an array of positive messages.

## !say {text}
  This will delete your message and make the bot say the text instead.

## !obeyme
  Will return a text-to-speech message mentioning it will obey the user who sent this command

## !game {index} or {text}
  If the index is within the array of games, it will set that to what they are playing. If the index is wrong or they use text, it will set that instead.
