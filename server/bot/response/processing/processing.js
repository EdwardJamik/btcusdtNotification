const cron = require("node-cron");
require("dotenv").config();

const { BOT_CHAT_ID } = process.env

module.exports = bot => {
    try {

        cron.schedule('*/5 * * * *', async () => {
            const User = require("../../../models/telegram_user.model");

            const currentDate = new Date()
            const nextDayDate = new Date()
            nextDayDate.setDate(nextDayDate.getDate() + 1);

            const usersAccessTimeOut = await User.find({access: true, access_time: {$lt: currentDate}}, {
                _id: 1,
                chat_id: 1,
                bot_started: 1,
                user_bot_ban: 1,
                ban: 1
            });

            const usersAccessTimeOutDay = await User.find({
                notification_access_end: false,
                access: true,
                access_time: {$lt: nextDayDate}
            }, {_id: 1, chat_id: 1, bot_started: 1, user_bot_ban: 1, ban: 1});

            if (usersAccessTimeOutDay) {
                for (const user of usersAccessTimeOutDay) {
                    if (user.bot_started && !user.user_bot_ban && !user.ban) {
                        await bot.telegram.sendMessage(user.chat_id, `😕 Ваша підписка добігає кінця через 24 години.`, {parse_mode: 'HTML'})
                        await User.updateOne({_id: user._id}, {notification_access_end: true});
                    }
                }
            }

            if (usersAccessTimeOut) {
                for (const user of usersAccessTimeOut) {
                    await User.updateOne({_id: user._id}, {access: false, notification_access_end: false});
                    await bot.telegram.unbanChatMember(BOT_CHAT_ID, user.chat_id)
                    if (user.bot_started && !user.user_bot_ban && !user.ban) {
                        await bot.telegram.sendMessage(user.chat_id, `😕 Ваша підписка на канал закінчилась.`, {parse_mode: 'HTML'})
                    }
                }
            }
        });
    } catch (e) {
        console.error(e)
    }
}