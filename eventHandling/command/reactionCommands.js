const Discord = require("discord.js");

// Message = message object that initiated command
// Params = The parameters of the command
// Globals = The global variables for the server that the command was initiated in
var commands = {
  "nice" : function(message, params, globals) {
    if (params[0] == null) {
      message.react('™');
    }
  },
  "deja" : function(message, params, globals) {
    if (params[0].toLowerCase() == "vu?" && !params[1]) {
      message.react("d");
      message.react("r");
      message.react("i");
      message.react("f");
      message.react("t");
    }
  }
}

module.exports.searchFunction = function(command) {
  return commands[command.toLowerCase()];
}

module.exports.close = function(globals, guild) {

}
