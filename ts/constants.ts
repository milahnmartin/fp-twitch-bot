const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

export const CHANNEL_NAME: string | undefined = process.env.CHANNEL_NAME;
export const OAUTH_TOKEN: string | undefined = process.env.OAUTH_TOKEN;
//ultrafy 'pyfxuat0yqzixwe49t0m2q9coqwrlq'

export const BOT_USERNAME: string = "fingerprintza";
export const BLOCKED_WORDS: string[] = ["test"];
export const CHANNELS: string[] = ["Ultrafy"];

//MYSQL

export const MYSQL_HOST: string = "";
export const MYSQL_USER: string = "";
export const MYSQL_PASSWORD: string = "";
export const MYSQL_DB: string = "";

//discord

export const WEBHOOK_TOKEN: string = "";
export const WEBHOOK_ID: string = "";
