import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

class OrderBookApi {
  async getOrderBook(url) {
    let orderBook = await axios(url);

    return orderBook.data;
  }
}

export default class OrderBookStore {

  @observable buyOrders = [];
  @observable sellOrders = [];
  @observable errorOnServer = false;
  baseToken = '';
  quoteToken = 'ETH';

  constructor() {
    this.orderBook = new OrderBookApi();
  }

  @action('get order book')
  async getOrderBook(url) {
    try {
      const orderBook = await this.orderBook.getOrderBook(url);

      runInAction(() => {
        this.assignByQuoteToken(orderBook, this.quoteToken);
      });
    } catch(e) {
      this.errorOnServer = new Error('Something wrong with API');
    }
  }

  assignByQuoteToken(orders, quoteToken) {
    let buyOrders = [];
    let sellOrders = [];
    orders.forEach(o => {
      if (o.tokenGiveSymbol !== quoteToken) {
        buyOrders.push(o);
        this.baseToken = o.tokenGiveSymbol; // getting base token
      } else {
        sellOrders.push(o);
      }
    });
    this.buyOrders = buyOrders;
    this.sellOrders = sellOrders;
  }
}
