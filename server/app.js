const SocketClient = require('./socketClient');
const SYMBOL = process.env.SYMBOL || 'btcusdt';

const orderBook = async function () {

  new SocketClient(`ws/${SYMBOL.toLowerCase()}@depth5000@100ms`);

}

module.exports = orderBook;