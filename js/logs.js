"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_twitch_log_discord = exports.create_twitch_log = void 0;
const constants_1 = require("./constants");
const fetch = require('node-fetch');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: constants_1.MYSQL_HOST,
    user: constants_1.MYSQL_USER,
    password: constants_1.MYSQL_PASSWORD,
    database: constants_1.MYSQL_DB
});
conn.connect((err) => {
    let database_query = "use `fp-logs`;";
    if (err)
        throw err;
    console.log("[CONNECTED TO DATABASE FP-LOGS]");
    console.log("[CONNECTED TO DISCORD LOGS]");
});
const create_twitch_log = (lUsername, lCommand, lTarget) => {
    let current_date = new Date().toString();
    let sql = "INSERT INTO `fp-twitch-bot`(`twitch_username`,`command_used`,`player_target`)VALUES(?,?,?);";
    conn.query(sql, [lUsername, lCommand, lTarget], (err, result, fields) => {
        if (err)
            throw ("Error Occurred, create twitch log");
        console.log("[TWITCH DATABASE ADDED A QUERY AT TIME] -> " + current_date);
    });
};
exports.create_twitch_log = create_twitch_log;
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient(constants_1.WEBHOOK_ID, constants_1.WEBHOOK_TOKEN);
const create_twitch_log_discord = (dName, dCommand, dTarget) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(`Twitch Username - ${dName} | Command Used - ${dCommand} | Target User - ${dTarget}`)
        .setColor('#0099ff');
    webhookClient.send('Fingerprint ZA -> Twitch Logs', {
        embeds: [embed]
    });
};
exports.create_twitch_log_discord = create_twitch_log_discord;
