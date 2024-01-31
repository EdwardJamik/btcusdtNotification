const { Telegraf, Markup } = require('telegraf');
require('dotenv').config()

const response = require('./response')
const processing = require('./response/processing/processing')

const bot = new Telegraf(`${process.env.BOT_TOKEN}`)

response(bot)
processing(bot)

module.exports = bot
