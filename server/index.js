const orderBook = require('./app');
const bot = require("./bot");
const app = require("./server.js");
const mongoose = require("mongoose");

require("dotenv").config();

const { MONGO_URL, BOT_PORT, PORT } = process.env
const listen_port = PORT || 5000;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.info('MongoDB is connected successfully')
    app.listen(listen_port, () => console.info(`Server running on PORT : ${listen_port}`))
    bot.launch(BOT_PORT, () => {
        console.info(`Telegram bot is running on port ${BOT_PORT}`);
    })
    orderBook();
}).catch(err => console.error(err))

