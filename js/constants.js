"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_ID = exports.WEBHOOK_TOKEN = exports.MYSQL_DB = exports.MYSQL_PASSWORD = exports.MYSQL_USER = exports.MYSQL_HOST = exports.CHANNELS = exports.BLOCKED_WORDS = exports.BOT_USERNAME = exports.OAUTH_TOKEN = exports.CHANNEL_NAME = void 0;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
exports.CHANNEL_NAME = process.env.CHANNEL_NAME;
exports.OAUTH_TOKEN = process.env.OAUTH_TOKEN;
//ultrafy 'pyfxuat0yqzixwe49t0m2q9coqwrlq'
exports.BOT_USERNAME = "fingerprintza";
exports.BLOCKED_WORDS = ["test"];
exports.CHANNELS = ["Ultrafy"];
//MYSQL
exports.MYSQL_HOST = "";
exports.MYSQL_USER = "";
exports.MYSQL_PASSWORD = "";
exports.MYSQL_DB = "";
//discord
exports.WEBHOOK_TOKEN = "";
exports.WEBHOOK_ID = "";
