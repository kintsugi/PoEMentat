var Emitter = require('./Emitter.js');
var storage = require('./storage.js');
var request = require('request');
var currencyValue = require('./currency-value.js');

class Autotrade {
  constructor() {
    this.trades = [];
    this.orders = [];

    Emitter.on('offerUpdate', (offers) =>
    {
      this.updateOrders(offers);
    });
  }

  addTrade(mainCurrencyId, alternateCurrencyId) {
    if(this.trades[mainCurrencyId + '-' + alternateCurrencyId] ||this.trades[alternateCurrencyId + '-' + mainCurrencyId]) {
      return;
    }
    this.trades.push(mainCurrencyId + '-' + alternateCurrencyId);
  }

  isTrading(mainCurrencyId, alternateCurrencyId) {
    return this.trades.includes(mainCurrencyId + '-' + alternateCurrencyId)|| this.trades.includes(alternateCurrencyId + '-' + mainCurrencyId);
  }

  removeTrade(mainCurrencyId, alternateCurrencyId) {
    let index = this.trades.indexOf(mainCurrencyId + '-' + alternateCurrencyId);
    if(index > -1) {
      this.trades.splice(index, 1);
    }
    index = this.trades.indexOf(alternateCurrencyId + '-' + mainCurrencyId);
    if(index > -1) {
      this.trades.splice(index, 1);
    }
  }

  updateOrders(offers) {
    let newOrders = [];
    for (let i in this.trades) {
      let trade = this.trades[i];
      let currencies = trade.split('-');
      let mainCurrencyId = currencies[0];
      let alternateCurrencyId = currencies[1];

      let sellOffers = offers[alternateCurrencyId + '-' + mainCurrencyId];
      let buyOffers = offers[mainCurrencyId + '-' + alternateCurrencyId];
      let minSell = sellOffers[0], maxBuy = buyOffers[0];

      let sellMPA = minSell.buy_value / minSell.sell_value;
      let buyMPA = maxBuy.sell_value / maxBuy.buy_value;
      let profitMPA = sellMPA - buyMPA;
      if(profitMPA > 0) {
        newOrders.push({
          mainCurrencyId: mainCurrencyId,
          alternateCurrencyId: alternateCurrencyId,
          sellOffer: minSell,
          buyOffer: maxBuy,
        });
      }
    }
    this.orders = newOrders;
    if(this.orders.length > 0) {
      this.postTrades();
    }
  }
  
  postTrades() {
    storage.get('settings')
    .then((settings) => {
      var cookie = 'league=Hardcore Essence; apikey= ' + settings.apiKey;
      var formString = 'league=Hardcore Essence&apikey=' + settings.apiKey;
      console.log(this.orders);
      for(let i in this.orders) {
        let order = this.orders[i];
        formString += '&sell_currency=' + currencyValue.currencyNames[parseInt(order.sellOffer.sell_currency_id)];
        formString += '&sell_value=' + order.sellOffer.sell_value;
        formString += '&buy_currency=' + currencyValue.currencyNames[parseInt(order.sellOffer.buy_currency_id)];
        formString += '&buy_value=' + order.sellOffer.buy_value;

        formString += '&sell_currency=' + currencyValue.currencyNames[parseInt(order.buyOffer.sell_currency_id)];
        formString += '&sell_value=' + order.buyOffer.sell_value;
        formString += '&buy_currency=' + currencyValue.currencyNames[parseInt(order.buyOffer.buy_currency_id)];
        formString += '&buy_value=' + order.buyOffer.buy_value;
      }
      request.post('http://currency.poe.trade/shop?league=Hardcore+Talisman',
        {
          headers: {
            'Cookie': cookie,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: formString 
        }, function(err, res, body) {
          if(err)
            console.log(err);
          console.log('posted');
          console.log(formString);
        });
    });
  }
}

function formShopData(formString, orders, index, cb) {
	if(index == orders.length) {
		cb(formString);
		return;
	}
	var order = orders[index];
	var enabled = order.enabled;
	if(order.autoEnable)
		enabled = checkOrderCurrencyCount(order);
	if(enabled) {
		console.log('turning on buy: ' + order.buyItemName + ' sell: ' + order.sellItemName);
		order.currency(function(err, currency) {
			formString += '&sell_currency=' + currency.sellItemName;
			if(order.orderType == 'sell') {
				formString += '&sell_value=' + order.sellItemQuantity; 
				formString += '&buy_value=' + order.buyItemQuantity; 
			} else if(order.orderType == 'buy') {
				formString += '&sell_value=' + order.sellItemQuantity; 
				formString += '&buy_value=' + order.buyItemQuantity; 
			}
			formString += '&buy_currency=' + currency.buyItemName; 
			order.updateAttributes({ 
				enabled: enabled,
			}, function(err, obj) {
				formShopData(formString, orders, index + 1, cb);
			});
		});
	} else {
		order.updateAttributes({ 
			enabled: enabled,
		}, function(err, obj) {
			formShopData(formString, orders, index + 1, cb);
		});
	}
}

function updateShop(orders, cb) {
	var cookie = 'league= ' + config.league + '; apikey= ' + config.apiKey;
	var formString = 'league=' + config.league + '&apikey=' + config.apiKey;
	formShopData(formString, orders, 0, function(completedForm) {
		request.post(config.shopPostUrl,
			{
				headers: {
					'Cookie': cookie,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				form: completedForm
			}, function(err, res, body) {
				if(err)
					console.log(err);
				cb();
			});
	});
	
}

module.exports = Autotrade;
