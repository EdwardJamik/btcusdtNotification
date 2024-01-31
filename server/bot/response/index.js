const User = require('../../models/telegram_user.model')
const Notification = require("../../models/notification.model");
const bot = require("../index");
require("dotenv").config();

module.exports = bot => {

    bot.command('start', async (ctx) => {
        try {
            const chat_id = ctx?.chat?.id
            const username = ctx?.chat?.username ? ctx.chat.username : 'Не вказано'
            const first_name = ctx?.chat?.first_name ? ctx.chat.first_name : 'Не вказано'
            const user = await User.findOne({chat_id})

            if (user) {
                if (!user?.ban) {
                    if (user.first_name !== first_name || user.username !== username)
                        await User.updateOne({chat_id}, {username, first_name})
                    ctx.deleteMessage()
                    ctx.replyWithHTML('Привіт 👋, я повідомлю коли твоя підписка закінчиться')
                }
            } else {
                ctx.deleteMessage()
                ctx.replyWithHTML('Привіт 👋, я повідомлю коли твоя підписка закінчиться')
                await User.insertMany({chat_id, username, first_name, bot_started: true})
            }

            ctx.setMyCommands(
                [
                    {command: 'chat_id', description: 'Мій chat_id'},
                    {command: 'sub_expir', description: 'Час дії підписки'},
                ]
            )
        } catch (e) {
            console.error(e)
        }
    });

    bot.command('chat_id', async (ctx) => {
        try {
            const chat_id = ctx?.chat?.id
            const user = await User.findOne({chat_id}, {ban: 1})
            if (!user?.ban) {
                ctx.replyWithHTML(`Ваш chat_id: <code>${chat_id}</code>`)
            }
        } catch (e) {
            console.error(e)
        }
    });

    bot.command('sub_expir', async (ctx) => {
        try {
            const chat_id = ctx?.chat?.id
            const user = await User.findOne({chat_id}, {access_time: 1, access: 1, ban: 1})

            if (!user?.ban) {
                if (!user?.access) {
                    ctx.replyWithHTML(`<b>❌ Ваша підписка на канал не активна</b>`)
                } else if (user?.access && user?.access_time) {
                    const currentTime = new Date();
                    const accessTime = new Date(user.access_time);
                    const timeDifference = accessTime.getTime() - currentTime.getTime();
                    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                    ctx.replyWithHTML(`<b>✅ Ваша підписка активна</b>\n\n⏳ ${daysRemaining % 10 === 1 && daysRemaining % 100 !== 11 ? `${daysRemaining} день` : ((daysRemaining % 10 === 2 || daysRemaining % 10 === 3 || daysRemaining % 10 === 4) && (daysRemaining % 100 < 10 || daysRemaining % 100 > 20)) ? `${daysRemaining} дні` : `${daysRemaining} днів`} ${(hoursRemaining === 1 || (hoursRemaining > 20 && hoursRemaining % 10 === 1)) ? `${hoursRemaining} година` : ((hoursRemaining === 0 || (hoursRemaining > 4 && hoursRemaining < 21)) || ((hoursRemaining % 10 === 0 || (hoursRemaining > 4 && hoursRemaining < 21)) && hoursRemaining > 10)) ? `${hoursRemaining} годин` : `${hoursRemaining} години`}`)
                }
            }
        } catch (e) {
            console.error(e)
        }
    });

    bot.on('message', async (ctx) => {
        try {
            const chat_id = ctx.update.message.chat.id
            const user = await User.findOne({chat_id})
            if (!user?.ban) {
                ctx.deleteMessage()

                ctx.replyWithHTML(`😕 Не розумію вас, оберіть дію`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: '👤 Мій chat_id', callback_data: 'chat_id'}
                            ],
                            [
                                {text: '⁉ Підписка', callback_data: 'sub_expire'}
                            ]
                        ]
                    }
                })
            }
        } catch (e) {
            console.error(e)
        }
    });

    bot.on('channel_post', async (ctx) =>{

        const message = ctx.update.channel_post.text
        const numbersAsString = message.split(' ');
        const numbers = numbersAsString.map(parseFloat);

        console.log(numbers)
        //
        // const oneStepBTC = 50
        // const twoStepBTC = 200
        // const threeStepBTC = 500
        //
        //
        //
        // const btcPrice = parseFloat(mainPrice)
        //
        // const bids = await Notification.findOne({
        //     type: 'bid',
        //     price: price,
        // }, {_id: 1, amount: 1});
        //
        // if (!bids) {
        //     const message = `<pre language="js">${btc >= oneStepBTC && btc < twoStepBTC ? '💵' : btc >= twoStepBTC && btc < threeStepBTC ? '💵💵' : '💵💵💵'} ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
        //     await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
        //     await Notification.insertMany({type: 'bid', amount: parseInt(btc), price: price})
        // } else {
        //     if (btc < oneStepBTC || bids.amount >= twoStepBTC && btc < twoStepBTC || bids.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount < threeStepBTC && btc >= threeStepBTC) {
        //         if (btc < oneStepBTC) {
        //             await Notification.deleteOne({_id: bids._id})
        //         } else if(bids.amount >= twoStepBTC && btc < twoStepBTC){
        //             await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
        //             const message = `<pre language="js">💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
        //             await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
        //         } else if (bids.amount < twoStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC || bids.amount >= threeStepBTC && btc >= twoStepBTC && btc > oneStepBTC && btc < threeStepBTC) {
        //             await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
        //             const message = `<pre language="js">💵💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
        //             await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
        //         } else if (bids.amount < threeStepBTC && btc >= threeStepBTC) {
        //             await Notification.updateOne({_id: bids._id}, {amount: parseInt(btc)})
        //             const message = `<pre language="js">💵💵💵 ${parseInt(btc)} BTC ($${price.toLocaleString('en-US')})\nPrice ($${btcPrice.toLocaleString('en-US')})</pre>`
        //             await bot.telegram.sendMessage(BOT_CHAT_ID, message, { parse_mode: 'HTML' })
        //         }
        //     }
        // }
    })

    bot.on('my_chat_member', async (ctx) => {
        try {
            const status = ctx?.update?.my_chat_member?.new_chat_member?.status
            const chat_id = ctx?.update?.my_chat_member?.chat?.id

            if (status === 'kicked' && chat_id) {
                await User.updateOne({chat_id}, {user_bot_ban: true})
            } else if (status === 'member' && chat_id) {
                await User.updateOne({chat_id}, {user_bot_ban: false})
            }
        } catch (e) {
            console.error(e)
        }
    });

    bot.on('callback_query', async (ctx) => {
        try {
            const callback = ctx?.update?.callback_query?.data
            const chat_id = ctx?.update?.callback_query?.message?.chat?.id

            const user = await User.findOne({chat_id})
            if (!user?.ban) {

                if (callback === 'chat_id') {
                    const chat_id = ctx?.chat?.id
                    ctx.editMessageText(`Ваш chat_id: <code>${chat_id}</code>`, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: '👈 Назад', callback_data: 'back'}
                                ]
                            ]
                        }, parse_mode: 'HTML'
                    })
                } else if (callback === 'sub_expire') {
                    const user = await User.findOne({chat_id}, {access_time: 1, access: 1})

                    if (!user?.access) {
                        ctx.editMessageText(`<b>❌ Ваша підписка на канал не активна</b>`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {text: '👈 Назад', callback_data: 'back'}
                                    ]
                                ]
                            }, parse_mode: 'HTML'
                        })
                    } else if (user?.access && user?.access_time) {
                        const currentTime = new Date();
                        const accessTime = new Date(user.access_time);
                        const timeDifference = accessTime.getTime() - currentTime.getTime();
                        const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                        ctx.editMessageText(`<b>✅ Ваша підписка активна</b>\n\n⏳ ${daysRemaining % 10 === 1 && daysRemaining % 100 !== 11 ? `${daysRemaining} день` : ((daysRemaining % 10 === 2 || daysRemaining % 10 === 3 || daysRemaining % 10 === 4) && (daysRemaining % 100 < 10 || daysRemaining % 100 > 20)) ? `${daysRemaining} дні` : `${daysRemaining} днів`} ${(hoursRemaining === 1 || (hoursRemaining > 20 && hoursRemaining % 10 === 1)) ? `${hoursRemaining} година` : ((hoursRemaining === 0 || (hoursRemaining > 4 && hoursRemaining < 21)) || ((hoursRemaining % 10 === 0 || (hoursRemaining > 4 && hoursRemaining < 21)) && hoursRemaining > 10)) ? `${hoursRemaining} годин` : `${hoursRemaining} години`}`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {text: '👈 Назад', callback_data: 'back'}
                                    ]
                                ]
                            }, parse_mode: 'HTML'
                        })
                    }
                } else if (callback === 'back') {
                    ctx.editMessageText(`Оберіть дію, натисніть на кнопку 👇`, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: '👤 Мій chat_id', callback_data: 'chat_id'}
                                ],
                                [
                                    {text: '⁉ Підписка', callback_data: 'sub_expire'}
                                ]
                            ]
                        }
                    })
                }
            }
        } catch (e) {
            console.error(e)
        }
    });

    bot.on('chat_join_request', async (ctx) => {
        try {
            const chat_id = ctx?.update?.chat_join_request?.user_chat_id
            const channel_id = ctx?.update?.chat_join_request?.chat?.id
            const username = ctx?.update?.chat_join_request?.from?.username
            const first_name = ctx?.update?.chat_join_request?.from?.first_name

            const user = await User.findOne({chat_id})

            if (user) {
                if (user?.ban) {
                    if (user?.access) {
                        const approve = await bot.telegram.approveChatJoinRequest(channel_id, chat_id)
                    } else if (!user?.test_access) {
                        let today = new Date();
                        today.setDate(today.getDate() + 2);
                        const approve = await bot.telegram.approveChatJoinRequest(channel_id, chat_id)
                        await User.updateOne({chat_id}, {
                            username,
                            first_name,
                            access: true,
                            access_time: today,
                            test_access: approve
                        })

                        if (user?.bot_started && !user?.user_bot_ban) {
                            if(user?.access){
                                await bot.telegram.sendMessage(chat_id, `<b>Ваша підписка на канал активована</b>`, {parse_mode: 'HTML'})
                            } else{
                                await bot.telegram.sendMessage(chat_id, `Вам надано тестову підписку на <b>2 дні</b>`, {parse_mode: 'HTML'})
                            }

                        }
                    } else if (!user?.access && user?.test_access) {
                        const decline = await bot.telegram.declineChatJoinRequest(channel_id, chat_id)
                        if (user?.bot_started && !user?.user_bot_ban && decline) {
                            await bot.telegram.sendMessage(chat_id, `😕 У вас відсутня підписка на канал.`)
                        }
                    }
                } else{
                    const decline = await bot.telegram.declineChatJoinRequest(channel_id, chat_id)
                }
            } else {
                let today = new Date();
                today.setDate(today.getDate() + 2);
                const approve = await bot.telegram.approveChatJoinRequest(channel_id, chat_id)
                await User.insertMany({
                    chat_id,
                    username,
                    first_name,
                    access: true,
                    access_time: today,
                    test_access: approve,
                    bot_started: true
                })
                await bot.telegram.sendMessage(chat_id, `Вам надано тестову підписку на <b>2 дні</b>`, {parse_mode: 'HTML'})
            }
        } catch (e) {
            console.error(e)
        }
    });
}