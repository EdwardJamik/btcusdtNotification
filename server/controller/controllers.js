const User = require("../models/admin.model");
const TgUsers = require("../models/telegram_user.model");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");
const bot = require("../bot");


module.exports.userList = async (req, res, next) => {
    try {
        const users = await TgUsers.find({}).sort({ access: -1 });

        res.json(users);
    } catch (error) {
        console.error(error);
    }
};

module.exports.banUser = async (req, res, next) => {
    try {
        const { chat_id, ban } = req.body;

        const changeBanUser = await TgUsers.updateOne({chat_id},{ban});

        res.json({success:true,message:`Користувача ${ban ? 'заблоковано':'розблоковано'}`});
    } catch (error) {
        console.error(error);
    }
};

module.exports.updatedAccess = async (req, res, next) => {
    try {
        require("dotenv").config();

        const { BOT_CHAT_ID } = process.env
        const bot = require('../bot')
        const { chat_id, access_time, access } = req.body;

        if(access){
            const users = await TgUsers.findOne({chat_id});
            const changeAccess = await TgUsers.updateOne({chat_id},{access_time, access, notification_access_end: false});
            if(!users.user_bot_ban && !users.ban){
                await bot.telegram.sendMessage(chat_id, `<b>Ваша підписка на канал активована</b>`, {parse_mode: 'HTML'})
            }
        } else{
            const users = await TgUsers.findOne({chat_id});
            const changeAccess = await TgUsers.updateOne({chat_id}, {access_time:new Date(), access, notification_access_end: false});
            await bot.telegram.unbanChatMember(BOT_CHAT_ID, chat_id)
            if(!users.user_bot_ban && !users.ban) {
                await bot.telegram.sendMessage(chat_id, `<b>Вашу підписку на канал деактивовано</b>`, {parse_mode: 'HTML'})
            }
        }

        res.json({success:true,message:`${access ? 'Користувачу наданий доступ' : 'Доступ відключено'}`});
    } catch (error) {
        console.error(error);
    }
};

module.exports.updatedAdminData = async (req, res, next) => {
    try {
        const { password, username } = req.body;

        if(username === '' || username === null)
            res.json({ message: "Не вказано новий логін", success: false });

        if(password === '' || password === null)
            res.json({ message: "Не вказано новий пароль", success: false });

        if(username && password){
            const newPassword = await bcrypt.hash(password, 12);
            const existingUser = await User.updateOne({ username, password: newPassword });
            res.json({ message: "Логін/Пароль до адмін панелі змінено", success: true });
        }


    } catch (error) {
        console.error(error);
    }
};

module.exports.DeleteUser = async (req, res, next) => {
    try {
        const { id } = req.body;
        const user = await User.deleteOne({_id:id });
        res.json({ message: "Користувача видалено", success: true });
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
            return res.json({message:'Заповніть всі поля'})
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.json({message:'Невірне ім`я користувача або пароль' })
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.json({message:'Невірний username або пароль' })
        }
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: false
        }).status(201).json({ message: "Користувач успішно авторизований", success: true });


    } catch (error) {
        console.error(error);
    }
}

module.exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.status(201).json({ message: "User logged in successfully", success: true });

    } catch (error) {
        console.error(error);
    }
}
