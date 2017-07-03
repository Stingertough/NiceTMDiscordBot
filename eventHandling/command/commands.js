const reddit = require("../../util/reddit.js");
const logUtil = require("../../util/logging.js");
const discordUtil = require("../../util/discordUtil.js");

var exec = require('child_process').exec;

var helpMessage = "```"; // The message displayed on the help message
helpMessage += "Miscallaneous Commands: ";
helpMessage += "\n1. !help - U wot m8?";
helpMessage += "\n2. !ping - Pong!";
helpMessage += "\n3. !oldman [whatever] - And old man tells you get off his lawn and take whatever with you.";
helpMessage += "\n4. !humourme - Gets a random picture from r/I_irl";
helpMessage += "\n5. !m [subredit] - Gets a random picture from the specified subreddit, and it can only be run on nsfw channels.";
helpMessage += "\n6. !github - Gives a link to the bot's source.";
helpMessage += "\n7. !link - Gives a link so you can add this bot to your server!";
helpMessage += "\n8. !genisland - Not \"genis-land\". It's \"gen-island\" Generates 1000x1000 island.";
helpMessage += "\n9. !noice - *POP* Noice!";

helpMessage += "\n\nMusic Commands: ";
helpMessage += "\n10. !play [url/id/search term] - Adds a youtube video to the queue.";
helpMessage += "\n11. !earrape [url/id/search term] - Adds a youtube video to the queue but it's better.";
helpMessage += "\n12. !nightcore [url/id/search term] - Adds a youtube video to the queue but it's even better.";
helpMessage += "\n13. !hospital [url/id/search term] - Adds a youtube video to the queue but it's better and even better.";
helpMessage += "\n14. !queue - Lists the current queue.";
helpMessage += "\n15. !skip - Skips the current song.";

helpMessage += "```";



// Message = message object that initiated command
// Params = The parameters of the command
// Globals = The global variables for the server that the command was initiated in
var commands = {
  "!help" : function(message, params, globals) {
    discordUtil.getDMChannel(message.author, function(dmChannel) {
      if (!dmChannel) {
        message.reply("Something went wrong with trying to DM you.");
      } else {
        message.reply("Look at your DMs.");


        dmChannel.send(helpMessage); // Display help message
      }
    });
  },
  "!ping" : function(message, params, globals) {
    message.channel.send("Pong!");
  },
  "nice" : function(message, params, globals) {
    if (params[0] == null) {
      message.react('™');
    }
  },
  "!oldman" : function(message, params, globals) { // To test parameters
    if (!params[0]) {
      message.channel.send("What did you say? Say something afterwards for a change!");
    } else {
      message.channel.send("Get off my lawn! And take your " + params.join(" ") + " with you!");
    }
  },
  "!humourme" : function(message, params, globals) {
    reddit.getRandomUrl("i_irl", function(url) {
      if (url) {
        message.channel.send(url);
      } else {
        message.channel.send("There was an error reaching /r/funny. Blame Finland.");
      }
    });
  },
  "!m" : function(message, params, globals) {
    if (message.channel.name.indexOf("nsfw") != -1) { // Check to see if channel name has nsfw
      if (params[0]) {
        reddit.getRandomUrl(params[0], function(url) {
          if (url) {
            message.channel.send(url);
          } else {
            message.channel.send("There was an error reaching /r/" + params[0] + ". Blame Finland.");
          }
        });
      } else {
        message.channel.send("Give me the subreddit name damnit!");
      }
    } else {
      message.channel.send("Please add nsfw to the channel name, this is reddit afterall.");
    }
  },
  "!github" : function(message, params, globals) {
    message.channel.send("https://github.com/tjpc3/NiceTMDiscordBot");
  },
  "!genisland" : function(message, params, globals) {
    message.channel.send("One island coming up!");
    var child = exec('java -jar ./jars/genisland.jar',
      function (error, stdout, stderr) {
        if(error !== null){
          console.log("Error running Jar file: " + error);
          message.channel.send("Error: Shit hit the fan.");
          return;
        }

        message.channel.send("", {files: ["map.jpg"]});
    });
  },
  "!test" : function(message, params, globals) {
    if (message.author.username != "tjpc3") {
      message.reply("Only the Robot Overlord is permitted to run this command.");
    } else {
      if (params[0] == "dc") {
        if (message.guild.voiceConnection != null) {
          message.guild.voiceConnection.disconnect();
        }
        return;
      }
    }
  },
  "!count" : function(message, params, globals) {
    var count = globals.get("count");
    if (count == undefined) {
      globals.set("count", 0);
      count = 0;
    } else {
      globals.set("count", count + 1);
      count++;
    }

    message.channel.send("Current count for this server is " + count + "!");

    return globals;
  },
  "!link" : function(message, params, globals) {
    message.channel.send("Here's the link: https://discordapp.com/oauth2/authorize?&client_id=318558676241874945&scope=bot&permissions=0 \nAdd me to your server whydontcha?");
  }
}

module.exports.searchFunction = function(command) {
  return commands[command.toLowerCase()];
}

module.exports.loop = function(globals, guild) {

}

module.exports.close = function(globals, guild) {

}
