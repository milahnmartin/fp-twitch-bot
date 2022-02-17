import tmi from "tmi.js";
import { BOT_USERNAME, OAUTH_TOKEN, CHANNEL_NAME, BLOCKED_WORDS, CHANNELS } from "./constants";
import { player_stats, error_api, twitch, api_status } from "./types";
// import {channel} from "diagnostic_channel";
import { create_twitch_log, create_twitch_log_discord } from "./logs";
import { Console } from "console";
import { stat } from "fs";
const fetch = require("node-fetch");

const check_api_connection = () => {
  let status_code: number = 200;
  try {
    fetch(`http://139.59.165.185:5069/get/Ultrafy/faceit/none`).then((resp: api_status) => {
      console.log("[THE CHECK FOR API STATUS WAS SUCCESFULL AND CODE 200 WAS RETURNED]");
      console.log("-------------------------------------------------------------------");
      status_code = 200;
    });
  } catch (e) {
    console.error("[ERROR OCCURED WE DIDNT GET STATUS CODE 200 FROM THE API]");
    status_code = 404;
    throw console.error("MASSIVE ERROR");
  } finally {
    fetch(
      "https://discordapp.com/api/webhooks/943650910096212008/Tw4CjJyI6dJI0-o8LoXaur6qU-417tmlFgsajXISBrXRzKn7dC6F6OI_soCBInbt5Wif",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // the username to be displayed
          username: "fingerprint-api-status",
          // the avatar to be displayed
          avatar_url:
            "https://cdn.discordapp.com/attachments/723568410079920261/943651506207477791/fp-logo.png",
          // contents of the message to be sent
          content: "<@&865311245019906129> - API Status Check Was Called",
          // enable mentioning of individual users or roles, but not @everyone/@here
          allowed_mentions: {
            parse: ["users", "roles"],
          },
          // embeds to be sent
          embeds: [
            {
              // decimal number colour of the side of the embed
              color: "0220255",
              // author
              // - icon next to text at top (text is a link)
              author: {
                name: "fingerprintza",
                url: "https://fingerprintza.com",
                icon_url:
                  "https://cdn.discordapp.com/attachments/723568410079920261/943651506207477791/fp-logo.png",
              },
              // embed title
              // - link on 2nd row
              // thumbnail
              // - small image in top right corner.
              thumbnail: {
                url: "https://cdn.discordapp.com/attachments/723568410079920261/943651506207477791/fp-logo.png",
              },
              // embed description
              // - text on 3rd row
              description: "A fingerprint API-STATUS-CHECK was Triggered",
              // custom embed fields: bold title/name, normal content/value below title
              // - located below description, above image.
              fields: [
                {
                  name: "API Status Code",
                  value: status_code,
                },
                {
                  name: "Check Passed",
                  value: status_code == 200 ? "True" : "False",
                },
              ],
              // image
              // - picture below description(and fields)
              image: {
                url: "https://cdn.discordapp.com/attachments/723568410079920261/943651506207477791/fp-logo.png",
              },
              // footer
              // - icon next to text at bottom
              footer: {
                text: "fingerprintza.com",
              },
            },
          ],
        }),
      }
    );
  }
};

check_api_connection();

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
    timeout: 180000,
    reconnectDecay: 1.4,
    reconnectInterval: 1000,
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: CHANNELS,
};

const client = new tmi.Client(options);

client.connect();

// events
client.on("disconnected", (reason) => {
  onDisconnectedHandler(reason);
});

client.on("connected", (address, port) => {
  onConnectedHandler(address, port);
});

client.on("hosted", (channel, username, viewers, autohost) => {
  onHostedHandler(channel, username, viewers, autohost);
});

client.on("subscription", (channel, username, method, message, userstate) => {
  onSubscriptionHandler(channel, username, method, message, userstate);
});

client.on("raided", (channel, username, viewers) => {
  onRaidedHandler(channel, username, viewers);
});

client.on("cheer", (channel, userstate, message) => {
  onCheerHandler(channel, userstate, message);
});

client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
  onGiftPaidUpgradeHandler(channel, username, sender, userstate);
});

client.on("hosting", (channel, target, viewers) => {
  onHostingHandler(channel, target, viewers);
});

client.on("reconnect", () => {
  reconnectHandler();
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
  resubHandler(channel, username, months, message, userstate, methods);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  subGiftHandler(channel, username, streakMonths, recipient, methods, userstate);
});

// event handlers

client.on("message", (channel, userstate, message, self) => {
  let user_response = message.split(" ");

  if (self) {
    return;
  }

  if (user_response[0].toLowerCase() === "!hello") {
    hello(channel, userstate);
    return;
  }

  let command: string = user_response[0];

  // if (command[0] === "!") {
  //   create_twitch_log(userstate.username, user_response[0], user_response[1]);
  //   create_twitch_log_discord(userstate.username, user_response[0], user_response[1]);
  // }

  if (user_response[0].toLowerCase() === "!faceit") {
    if (!user_response[1]) {
      client.say(
        channel,
        "@" + userstate.username + " you forgot to add a name, example !faceit Fadey-"
      );
      return;
    } else if (user_response[0] === "!faceit" && user_response[1] && !user_response[2]) {
      client.say(
        channel,
        "@" + userstate.username + " Fetching faceit data for " + user_response[1] + " ->"
      );
      faceit_data(user_response[1]).then((data) => {
        client.say(channel, data);
      });
      return;
    } else if (user_response[0] === "!faceit" && user_response[1] && user_response[2]) {
      client.say(channel, "We are mapping data...");
      faceit_map(user_response[1], user_response[2].toLowerCase()).then((data) => {
        client.say(channel, data);
      });
    }
  }

  // onMessageHandler(channel, userstate, message, self)
});

function onMessageHandler(channel: any, userstate: any, message: any, self: any) {
  checkTwitchChat(userstate, message, channel);
}

function onDisconnectedHandler(reason: any) {
  console.log(`Disconnected: ${reason}`);
}

function onConnectedHandler(address: any, port: any) {
  console.log(`Connected: ${address}:${port}`);
}

function onHostedHandler(channel: any, username: any, viewers: any, autohost: any) {
  client.say(channel, `Thank you @${username} for the host of ${viewers}!`);
}

function onRaidedHandler(channel: any, username: any, viewers: any) {
  client.say(channel, `Thank you @${username} for the raid of ${viewers}!`);
}

function onSubscriptionHandler(
  channel: any,
  username: any,
  method: any,
  message: any,
  userstate: any
) {
  client.say(channel, `Thank you @${username} for subscribing!`);
}

function onCheerHandler(channel: any, userstate: any, message: any) {
  client.say(channel, `Thank you @${userstate.username} for the ${userstate.bits} bits!`);
}

function onGiftPaidUpgradeHandler(channel: any, username: any, sender: any, userstate: any) {
  client.say(channel, `Thank you @${username} for continuing your gifted sub!`);
}

function onHostingHandler(channel: any, target: any, viewers: any) {
  client.say(channel, `We are now hosting ${target} with ${viewers} viewers!`);
}

function reconnectHandler() {
  console.log("Reconnecting...");
}

function resubHandler(
  channel: any,
  username: any,
  months: any,
  message: any,
  userstate: any,
  methods: any
) {
  const cumulativeMonths = userstate["msg-param-cumulative-months"];
  client.say(channel, `Thank you @${username} for the ${cumulativeMonths} sub!`);
}

function subGiftHandler(
  channel: any,
  username: any,
  streakMonths: any,
  recipient: any,
  methods: any,
  userstate: any
) {
  client.say(channel, `Thank you @${username} for gifting a sub to ${recipient}}.`);

  // this comes back as a boolean from twitch, disabling for now
  // "msg-param-sender-count": false
  // const senderCount =  ~~userstate["msg-param-sender-count"];
  // client.say(channel,
  //   `${username} has gifted ${senderCount} subs!`
  // )
}

// commands

async function faceit_data(pname: string): Promise<any> {
  try {
    const data = await fetch(`http://127.0.0.1:5069/get/${pname}/faceit/none`);
    const data_response = await data.json();
    let stats_obj: player_stats = data_response.lifetime;

    let recent_result: string[] = stats_obj["Recent Results"];
    let _recent_result: string[] = [];

    for (let i of recent_result) {
      if (i === "0") {
        _recent_result.push("W");
      } else {
        _recent_result.push("L");
      }
    }

    return `Average Headshot % - ${stats_obj["Average Headshots %"]}
                Average K/D Ratio - ${stats_obj["Average K/D Ratio"]}
                Current Win Streak - ${stats_obj["Current Win Streak"]}
                K/D Ratio - ${stats_obj["K/D Ratio"]}
                Longest Win Streak -${stats_obj["Longest Win Streak"]}
                Total Matches - ${stats_obj.Matches}
                Recent Results - ${_recent_result}
                Total Wins - ${stats_obj.Wins}
                Win Rate - ${stats_obj["Win Rate %"]}`;
  } catch (e) {
    return "Sorry, error occured, user " + pname + " doesn't exist";
  } finally {
    console.log("Try Statement Finished ..");
  }
}

async function faceit_map(puser: string, pmap: string): Promise<any> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get/${puser}/faceit/${pmap}`);
    const map_data = await response.json();
    console.log(map_data);
    const maps_stats = map_data.stats;
    console.log(maps_stats);
    return `Map: ${map_data["label"]}
            Average Assists: ${maps_stats["Average Assists"]}
            Average Deaths: ${maps_stats["Average Deaths"]}
            Average Headshots %: ${maps_stats["Average Headshots %"]}
            Average K/D Ratio: ${maps_stats["Average K/D Ratio"]}
            Average Kills: ${maps_stats["Average Kills"]}
            Average MVP's: ${maps_stats["Average MVPs"]}
            Average Penta Kills: ${maps_stats["Average Penta Kills"]}
            Average Quadro Kills: ${maps_stats["Average Quadro Kills"]}
            Average Triple Kills: ${maps_stats["Average Triple Kills"]}
            Deaths Total: ${maps_stats["Deaths"]}
            Headshots Total: ${maps_stats["Headshots"]}
            Kills Total: ${maps_stats["Kills"]}
            Total Matches: ${maps_stats["Matches"]}
            MVPs Total: ${maps_stats["MVPs"]}
            Rounds Total: ${maps_stats["Rounds"]}
            Wins Total: ${maps_stats["Wins"]}
              
        `;
  } catch (e) {
    return `Error Occured map doesn't exist, or player doesnt exist`;
  } finally {
    console.log("Map function called...");
  }
}

function hello(channel: any, userstate: any) {
  client.say(channel, `@${userstate.username}, heya!`);
}

function user(channel: any, userstate: any) {
  client.say(channel, `@${userstate.username}, user !`);
}

function checkTwitchChat(userstate: any, message: any, channel: any) {
  console.log(message);
  message = message.toLowerCase();
  let shouldSendMessage = false;
  shouldSendMessage = BLOCKED_WORDS.some((blockedWord) =>
    message.includes(blockedWord.toLowerCase())
  );
  if (shouldSendMessage) {
    // tell user
    client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`);
    // delete message
    client.deletemessage(channel, userstate.id);
  }
}
