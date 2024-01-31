const WebSocket = require('ws');
const {notificationBid, notificationAsk} = require("./bot/response/notification/notification");

class SocketClient {
  constructor(path) {
    this.baseUrl = 'wss://stream.binance.com:9443/';
    this._path = path;
    this._price = 0;
    this._createSocket();
    this._createSocketPrice();

    this._minPrice = 1000;
    this._maxPrice = 1000;

    this._oneStepBTC = 90
    this._twoStepBTC = 190
    this._threeStepBTC = 500
  }

  _createSocket() {
    this._ws = new WebSocket(`${this.baseUrl}${this._path}`);

    this._ws.onopen = () => {
      const msg = {
        method: 'SUBSCRIBE',
        params: ['btcusdt@depth@100ms'],
        id: 1
      };
      this._ws.send(JSON.stringify(msg));
      console.log((new Date()).toISOString(), 'ws connected');
    };

    this._ws.onclose = () => {
      console.log((new Date()).toISOString(), 'ws closed');
      setTimeout(() => {
        this._createSocket();
        console.log((new Date()).toISOString(), 'ws restart');
      }, 5000);
    };

    this._ws.onerror = (err) => {
      console.log((new Date()).toISOString(), 'ws error', err);
      setTimeout(() => {
        this._createSocket();
        console.log((new Date()).toISOString(), 'ws restart');
      }, 5000);
    };

    this._ws.onmessage = async (msg) => {
      try {
        const message = JSON.parse(msg.data);

        if (message.b) {
          await Promise.all(message.b.map(async (item) => {
            const price = parseFloat(item[0]);
            const btc = parseFloat(item[1]);
            // console.log(this._price)
            // console.log(this._price + this._minPrice)
            if(price >= 41000 && btc >= this._oneStepBTC){
              console.log(price, btc, this._price)
            }
            if (price >= (this._price - this._minPrice) && price <= (this._price + this._maxPrice) && btc >= this._oneStepBTC) {
              // console.log(price, btc, this._price)
              if (btc < this._twoStepBTC && btc < this._threeStepBTC) {
                notificationBid(price, btc, this._price);
              } else if (btc >= this._twoStepBTC && btc < this._threeStepBTC) {
                notificationBid(price, btc, this._price);
              } else {
                notificationBid(price, btc, this._price);
              }
            }
          }));
        }

        if (message.a) {
          await Promise.all(message.a.map(async (item) => {
            const price = parseFloat(item[0]);
            const btc = parseFloat(item[1]);

            if(price >= 41000 && btc >= this._oneStepBTC){
              console.log(price, btc, this._price)
            }

            if (price >= (this._price - this._minPrice) && price <= (this._price + this._maxPrice) && btc >= this._oneStepBTC) {
              // console.log(price, btc, this._price)
              if (btc < this._twoStepBTC && btc < this._threeStepBTC) {
                notificationAsk(price, btc, this._price);
              } else if (btc >= this._twoStepBTC && btc < this._threeStepBTC) {
                notificationAsk(price, btc, this._price);
              } else {
                notificationAsk(price, btc, this._price);
              }
            }
          }));
        }

      } catch (e) {
        console.log((new Date()).toISOString(), 'Parse message failed', e);
      }
    };
  }

  _createSocketPrice() {
    this._ws_price = new WebSocket(`${this.baseUrl}ws/btcusdt@trade`);

    this._ws_price.onopen = () => {
      const msg = {
        method: 'SUBSCRIBE',
        params: ['btcusdt@trade'],
        id: 2
      };
      this._ws_price.send(JSON.stringify(msg));
      console.log((new Date()).toISOString(), 'ws_price connected');
    };

    this._ws_price.onclose = () => {
      console.log((new Date()).toISOString(), 'ws_price closed');
      setTimeout(() => {
        this._createSocketPrice();
        console.log((new Date()).toISOString(), 'ws_price restart');
      }, 5000);
    };

    this._ws_price.onerror = (err) => {
      console.log((new Date()).toISOString(), 'ws_price error', err);
      setTimeout(() => {
        this._createSocketPrice();
        console.log((new Date()).toISOString(), 'ws_price restart');
      }, 5000);
    };

    this._ws_price.onmessage = (msg) => {
      try {
        const message = JSON.parse(msg.data);
        this._price = parseFloat(message.p)
      } catch (e) {
        console.log((new Date()).toISOString(), 'Parse message failed', e);
      }
    };
  }
}

module.exports = SocketClient;
