const bot = require('../../index')
const Notification = require("../../../models/notification.model");
require("dotenv").config();

const { BOT_CHAT_ID } = process.env

const oneStepBTC = 90
const twoStepBTC = 190
const threeStepBTC = 500

async function notificationAsk(price, btc, mainPrice) {



    const btcPrice = parseInt(mainPrice)

    const ask = await Notification.findOne({
        type: 'ask',
        price: price,
    }, {_id: 1, amount: 1, updatedAt:1});

    if (!ask) {
            const message = `<pre language="js">${btc >= oneStepBTC && btc < twoStepBTC ? '🚨' : btc >= twoStepBTC && btc < threeStepBTC ? '🚨🚨' : '🚨🚨🚨'} ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
            await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            await Notification.insertMany({type: 'ask', amount: parseInt(btc), price: price})
    } else {
        if (btc < oneStepBTC || ask.amount >= twoStepBTC && btc < twoStepBTC || ask.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || ask.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || ask.amount < threeStepBTC && btc >= threeStepBTC) {
            if (btc < oneStepBTC) {
                await Notification.deleteOne({_id: ask._id})
            } else if(ask.amount >= twoStepBTC && btc < twoStepBTC){
                await Notification.updateOne({_id: ask._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">🚨 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            } else if (ask.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || ask.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC) {
                await Notification.updateOne({_id: ask._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">🚨🚨 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            } else if (ask.amount < threeStepBTC && btc >= threeStepBTC) {
                await Notification.updateOne({_id: ask._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">🚨🚨🚨 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            }
        }
    }
    await deletedLevel(mainPrice);
}

async function notificationBid(price,btc, mainPrice) {

    const btcPrice = parseInt(mainPrice)

    const bids = await Notification.findOne({
        type: 'bid',
        price: price,
    }, {_id: 1, amount: 1});

    if (!bids) {
        const message = `<pre language="js">${btc >= oneStepBTC && btc < twoStepBTC ? '💵' : btc >= twoStepBTC && btc < threeStepBTC ? '💵💵' : '💵💵💵'} ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
        await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
        await Notification.insertMany({type: 'bid', amount: parseInt(btc), price: price})
    } else {
        if (btc < oneStepBTC || bids.amount >= twoStepBTC && btc < twoStepBTC || bids.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount < threeStepBTC && btc >= threeStepBTC) {
            if (btc < oneStepBTC) {
                await Notification.deleteOne({_id: bids._id})
            } else if(bids.amount >= twoStepBTC && btc < twoStepBTC){
                await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            } else if (bids.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC) {
                await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">💵💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            } else if (bids.amount < threeStepBTC && btc >= threeStepBTC) {
                await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
                const message = `<pre language="js">💵💵💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
                await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
            }
        }
    }
    await deletedLevel(mainPrice);
}

async function deletedLevel(mainPrice) {
    if(mainPrice){
        const mainPriceLow = parseFloat(mainPrice) - 1000
        const mainPriceHight = parseFloat(mainPrice) + 1000
        await Notification.deleteMany({$or: [{ price: { $gt: mainPriceHight } },{ price: { $lt: mainPriceLow } }]})
    }
}

module.exports = {notificationBid, notificationAsk}