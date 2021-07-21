"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = __importDefault(require("tmi.js"));
const constants_1 = require("./constants");
const fetch = require('node-fetch');
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
        username: constants_1.BOT_USERNAME,
        password: constants_1.OAUTH_TOKEN
    },
    channels: constants_1.CHANNELS
};
const client = new tmi_js_1.default.Client(options);
client.connect();
// events
client.on('disconnected', (reason) => {
    onDisconnectedHandler(reason);
});
client.on('connected', (address, port) => {
    onConnectedHandler(address, port);
});
client.on('hosted', (channel, username, viewers, autohost) => {
    onHostedHandler(channel, username, viewers, autohost);
});
client.on('subscription', (channel, username, method, message, userstate) => {
    onSubscriptionHandler(channel, username, method, message, userstate);
});
client.on('raided', (channel, username, viewers) => {
    onRaidedHandler(channel, username, viewers);
});
client.on('cheer', (channel, userstate, message) => {
    onCheerHandler(channel, userstate, message);
});
client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
    onGiftPaidUpgradeHandler(channel, username, sender, userstate);
});
client.on('hosting', (channel, target, viewers) => {
    onHostingHandler(channel, target, viewers);
});
client.on('reconnect', () => {
    reconnectHandler();
});
client.on('resub', (channel, username, months, message, userstate, methods) => {
    resubHandler(channel, username, months, message, userstate, methods);
});
client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
    subGiftHandler(channel, username, streakMonths, recipient, methods, userstate);
});
// event handlers
client.on('message', (channel, userstate, message, self) => {
    let user_response = message.split(" ");
    if (self) {
        return;
    }
    if (user_response[0].toLowerCase() === '!hello') {
        hello(channel, userstate);
        return;
    }
    if (user_response[0].toLowerCase() === '!faceit') {
        if (!user_response[1]) {
            client.say(channel, '@' + userstate.username + " you forgot to add a name, example !faceit Fadey-");
            return;
        }
        else {
            client.say(channel, '@' + userstate.username + " Fetching faceit data for " + user_response[1] + " ->");
            faceit(channel, userstate, user_response[1])
                .then(data => {
                client.say(channel, data);
            });
            return;
        }
    }
    // onMessageHandler(channel, userstate, message, self)
});
function onMessageHandler(channel, userstate, message, self) {
    checkTwitchChat(userstate, message, channel);
}
function onDisconnectedHandler(reason) {
    console.log(`Disconnected: ${reason}`);
}
function onConnectedHandler(address, port) {
    console.log(`Connected: ${address}:${port}`);
}
function onHostedHandler(channel, username, viewers, autohost) {
    client.say(channel, `Thank you @${username} for the host of ${viewers}!`);
}
function onRaidedHandler(channel, username, viewers) {
    client.say(channel, `Thank you @${username} for the raid of ${viewers}!`);
}
function onSubscriptionHandler(channel, username, method, message, userstate) {
    client.say(channel, `Thank you @${username} for subscribing!`);
}
function onCheerHandler(channel, userstate, message) {
    client.say(channel, `Thank you @${userstate.username} for the ${userstate.bits} bits!`);
}
function onGiftPaidUpgradeHandler(channel, username, sender, userstate) {
    client.say(channel, `Thank you @${username} for continuing your gifted sub!`);
}
function onHostingHandler(channel, target, viewers) {
    client.say(channel, `We are now hosting ${target} with ${viewers} viewers!`);
}
function reconnectHandler() {
    console.log('Reconnecting...');
}
function resubHandler(channel, username, months, message, userstate, methods) {
    const cumulativeMonths = userstate['msg-param-cumulative-months'];
    client.say(channel, `Thank you @${username} for the ${cumulativeMonths} sub!`);
}
function subGiftHandler(channel, username, streakMonths, recipient, methods, userstate) {
    client.say(channel, `Thank you @${username} for gifting a sub to ${recipient}}.`);
    // this comes back as a boolean from twitch, disabling for now
    // "msg-param-sender-count": false
    // const senderCount =  ~~userstate["msg-param-sender-count"];
    // client.say(channel,
    //   `${username} has gifted ${senderCount} subs!`
    // )
}
// commands
function faceit(channel, userstate, pname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetch(`http://127.0.0.1:5000/get/${pname}/faceit`);
            const data_response = yield data.json();
            let stats_obj = data_response.lifetime;
            return `Average Headshot % - ${stats_obj['Average Headshots %']}
                Average K/D Ratio - ${stats_obj['Average K/D Ratio']}
                Current Win Streak - ${stats_obj['Current Win Streak']}
                K/D Ratio - ${stats_obj['K/D Ratio']}
                Longest Win Streak -${stats_obj['Longest Win Streak']}
                Total Matches - ${stats_obj.Matches}
                Recent Results - ${stats_obj['Recent Results']}
                Total Wins - ${stats_obj.Wins}
                Win Rate - ${stats_obj['Win Rate %']}`;
        }
        catch (e) {
            return 'Sorry, error occured, user ' + pname + " doesn't exist";
        }
        finally {
            console.log('Try Statement Finished ..');
        }
    });
}
function hello(channel, userstate) {
    client.say(channel, `@${userstate.username}, heya!`);
}
function user(channel, userstate) {
    client.say(channel, `@${userstate.username}, user !`);
}
function checkTwitchChat(userstate, message, channel) {
    console.log(message);
    message = message.toLowerCase();
    let shouldSendMessage = false;
    shouldSendMessage = constants_1.BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));
    if (shouldSendMessage) {
        // tell user
        client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`);
        // delete message
        client.deletemessage(channel, userstate.id);
    }
}
