import tmi from 'tmi.js'
import { BOT_USERNAME , OAUTH_TOKEN, CHANNEL_NAME, BLOCKED_WORDS } from './constants'

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

client.on('message', (channel, userstate, message, self) => {
  if(self) {
    return
  }

	if(message.toLowerCase() === '!hello') {
    hello(channel, userstate)
    return
  }

  if(message.toLowerCase() === '!faceit'){
    client.say(channel,"Its Working bitch");
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