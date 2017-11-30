const fs = require("fs");
const logUtil = require("../../util/logging.js");

const Discord = require('discord.js');

// Message = message object that initiated command
// Params = The parameters of the command
// Globals = The global variables for the server that the command was initiated in
var commands = {
  ";;archive" : function(message, params, globals) { // Usage: ;;archive [messages]
    if (!(message.author.id == 150699865997836288 || message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR))) {
      message.channel.send("Only administrators are permitted to run this command.");
    } else if (!params[0]) {
      message.channel.send("Specify the amount of messages to archive.")
    } else if (!isNaN(params[0]) && params[0] != "all") {
      message.channel.send("The amount of messages is invalid.");
    } else {
      message.channel.send("This may take a while...");

      var inputFile = fs.createWriteStream(message.id + ".txt");

      writeMessages(message.id, params[0], inputFile, message.channel, function() {
        setTimeout(() => {
            message.channel.send({files: [message.id + ".txt"]});
            setTimeout(() => {
                fs.unlink(message.id + ".txt");
            }, 1000);
        }, 1000);
      });

    }

    return globals;
  },
  ";;s" : function(message, params, globals) { // Usage: ;;archive [messages] [file]
    if (message.author.id != 150699865997836288) {
      // Do nothing
    } else if (!params[2]) {
      message.channel.send("You forgot all of the parameters, idiot.");
    } else {
      var guild = message.client.guilds.get(params[0]);
      if (guild) {
        var channel = guild.channels.get(params[1]);
        if (channel) {
          params.splice(0, 2);
          channel.send(params.join(" "));
        } else {
          message.channel.send("Channel not found.");
        }
      } else {
        message.channel.send("Guild not found.");
      }
    }

    return globals;
  }
}

function writeMessages(before, limit, writeStream, channel, callback, totalMessages = 0) {
  channel.messages.fetch({"before" : before, "limit" : 100}).then(messages => {
    logUtil.log(`Received ${messages.size} messages from channel ${channel.name}.`, logUtil.STATUS_NOTIFICATION);

    var reverseMessages = Array.from(messages);

    if (limit != "all") {
      for (let message of reverseMessages) {
        if (limit <= 0) {
          break;
        }

        var dataToLog = `${new Date(message[1].createdTimestamp).toString()} <${message[1].author.username}> ${message[1].content}\r\n`;
        writeStream.write(dataToLog);
        totalMessages++;
        limit--;
      }
    } else {
      for (let message of reverseMessages) {
        var dataToLog = `${new Date(message[1].createdTimestamp).toString()} <${message[1].author.username}> ${message[1].content}\r\n`;
        writeStream.write(dataToLog);
        totalMessages++;
      }
    }

    if (reverseMessages.length < 100) { // Finished getting all messages
      channel.send(`Finished getting ${totalMessages} messages.`);
      callback();
    } else {
      writeMessages(reverseMessages[reverseMessages.length - 1][1].id, limit, writeStream, channel, callback, totalMessages);
    }
  }).catch(error => {
    logUtil.log(`Error getting messages.`, logUtil.STATUS_ERROR);
    console.log(error);
  });
}

module.exports.searchFunction = function(command) {
  return commands[command.toLowerCase()];
}

module.exports.close = function(globals, guild) {

}
