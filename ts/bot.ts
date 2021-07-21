import tmi from 'tmi.js'
import { BOT_USERNAME , OAUTH_TOKEN, CHANNEL_NAME, BLOCKED_WORDS } from './constants'
import {player_stats} from "./types";
import {stat} from "fs";
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
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ 'ultrafy' ]
}

const client = new tmi.Client(options)

client.connect()

// events
client.on('disconnected', (reason) => {
  onDisconnectedHandler(reason)
})

client.on('connected', (address, port) => {
  onConnectedHandler(address, port)
})

client.on('hosted', (channel, username, viewers, autohost) => {
  onHostedHandler(channel, username, viewers, autohost)
})

client.on('subscription', (channel, username, method, message, userstate) => {
  onSubscriptionHandler(channel, username, method, message, userstate)
})

client.on('raided', (channel, username, viewers) => {
  onRaidedHandler(channel, username, viewers)
})

client.on('cheer', (channel, userstate, message) => {
  onCheerHandler(channel, userstate, message)
})

client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
  onGiftPaidUpgradeHandler(channel, username, sender, userstate)
})

client.on('hosting', (channel, target, viewers) => {
  onHostingHandler(channel, target, viewers)
})

client.on('reconnect', () => {
  reconnectHandler()
})

client.on('resub', (channel, username, months, message, userstate, methods) => {
  resubHandler(channel, username, months, message, userstate, methods)
})

client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
  subGiftHandler(channel, username, streakMonths, recipient, methods, userstate)
})



// event handlers

client.on('message', (channel, userstate, message, self) =>  {
  let user_response = message.split(" ");


  if(self) {
    return;
  }

	if(user_response[0].toLowerCase() === '!hello') {
    hello(channel, userstate);
    return;
  }

	if(user_response[0].toLowerCase() === '!faceit'){
      client.say(channel,'@'+userstate.username + " Fetching faceit data for " + user_response[1] + " ->");
      faceit(channel,userstate,user_response[1])
          .then(data=>{
            client.say(channel, data);
          })

	  return;
    }


  // onMessageHandler(channel, userstate, message, self)
})

function onMessageHandler (channel:any, userstate:any, message:any, self:any) {
  checkTwitchChat(userstate, message, channel)
}

function onDisconnectedHandler(reason:any) {
  console.log(`Disconnected: ${reason}`)
}

function onConnectedHandler(address:any, port:any) {
  console.log(`Connected: ${address}:${port}`)
}

function onHostedHandler (channel:any, username:any, viewers:any, autohost:any) {
  client.say(channel,
    `Thank you @${username} for the host of ${viewers}!`
  )
}

function onRaidedHandler(channel:any, username:any, viewers:any) {
  client.say(channel,
    `Thank you @${username} for the raid of ${viewers}!`
  )
}

function onSubscriptionHandler(channel:any, username:any, method:any, message:any, userstate:any) {
  client.say(channel,
    `Thank you @${username} for subscribing!`
  )
}

function onCheerHandler(channel:any, userstate:any, message:any)  {
  client.say(channel,
    `Thank you @${userstate.username} for the ${userstate.bits} bits!`
  )
}

function onGiftPaidUpgradeHandler(channel:any, username:any, sender:any, userstate:any) {
  client.say(channel,
    `Thank you @${username} for continuing your gifted sub!`
  )
}

function onHostingHandler(channel:any, target:any, viewers:any) {
  client.say(channel,
    `We are now hosting ${target} with ${viewers} viewers!`
  )
}

function reconnectHandler () {
  console.log('Reconnecting...')
}

function resubHandler(channel:any, username:any, months:any, message:any, userstate:any, methods:any) {
  const cumulativeMonths = userstate['msg-param-cumulative-months']
  client.say(channel,
    `Thank you @${username} for the ${cumulativeMonths} sub!`
  )
}

function subGiftHandler(channel:any, username:any, streakMonths:any, recipient:any, methods:any, userstate:any) {

  client.say(channel,
    `Thank you @${username} for gifting a sub to ${recipient}}.`
  )

  // this comes back as a boolean from twitch, disabling for now
  // "msg-param-sender-count": false
  // const senderCount =  ~~userstate["msg-param-sender-count"];
  // client.say(channel,
  //   `${username} has gifted ${senderCount} subs!`
  // )
}

// commands

async function faceit(channel:any,userstate:any,pname:string) :Promise<any>{
  try {
    const data = await fetch(`http://127.0.0.1:5000/get/${pname}/faceit`)
    const data_response = await data.json();
    let stats_obj:player_stats = data_response.lifetime;

    return `    Average Headshot % - ${stats_obj['Average Headshots %']}
                Average K/D Ratio - ${stats_obj['Average K/D Ratio']}
                Current Win Streak - ${stats_obj['Current Win Streak']}
                K/D Ratio - ${stats_obj['K/D Ratio']}
                Longest Win Streak -${stats_obj['Longest Win Streak']}
                Total Matches - ${stats_obj.Matches}
                Recent Results - ${stats_obj['Recent Results']}
                Total Wins - ${stats_obj.Wins}
                Win Rate - ${stats_obj['Win Rate %']}
                
            `

  }catch (e){
    return 'Sorry, error occured, user ' + pname + " doesn't exist"

  }finally {
    console.log('Try Statement Finished ..')
  }

}



function hello (channel:any, userstate:any) {
  client.say(channel, `@${userstate.username}, heya!`)
}

function user(channel:any,userstate:any){
  client.say(channel, `@${userstate.username}, user !`)
}

function checkTwitchChat(userstate:any, message:any, channel:any) {
  console.log(message)
  message = message.toLowerCase()
  let shouldSendMessage = false
  shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
  if (shouldSendMessage) {
    // tell user
    client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`)
    // delete message
    client.deletemessage(channel, userstate.id)
  }
}