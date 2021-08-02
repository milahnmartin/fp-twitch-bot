import {MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER,WEBHOOK_ID,WEBHOOK_TOKEN} from './constants';
const fetch = require('node-fetch');
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password:MYSQL_PASSWORD,
    database:MYSQL_DB
});

conn.connect((err:any)=>{
    let database_query:string = "use `fp-logs`;";
    if(err)throw err;
    console.log("[CONNECTED TO DATABASE FP-LOGS]");
    console.log("[CONNECTED TO DISCORD LOGS]");
})



export const create_twitch_log = (lUsername:string|undefined,lCommand:string,lTarget:string):void => {
    let current_date:string = new Date().toString();
    let sql:string = "INSERT INTO `fp-twitch-bot`(`twitch_username`,`command_used`,`player_target`)VALUES(?,?,?);";

        conn.query(sql,[lUsername,lCommand,lTarget],(err:any,result:any,fields:any)=>{
            if(err)throw("Error Occurred, create twitch log");
            console.log("[TWITCH DATABASE ADDED A QUERY AT TIME] -> " + current_date);
        });


};
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient(WEBHOOK_ID,WEBHOOK_TOKEN);



export const create_twitch_log_discord = (dName:string | undefined,dCommand:string,dTarget:string) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(`Twitch Username - ${dName} | Command Used - ${dCommand} | Target User - ${dTarget}`)
        .setColor('#0099ff')

    webhookClient.send('Fingerprint ZA -> Twitch Logs',{
        embeds:[embed]
    });
}