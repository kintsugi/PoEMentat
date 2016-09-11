const remote = require('electron').remote;
const {dialog} = require('electron').remote;
var fs = require('fs');
var throwErr = require('./js/throwErr.js');
var clientTxtWatcher = new require('./js/clientTxtWatcher.js');
var Emitter = require('./js/Emitter.js');
var modal = require('./js/modal.js');
var storage = require('./js/storage.js');
var clientTxtUtility = require('./js/clientTxtUtility.js');
var config = require('./js/config.js');
var database = require('../database.js');
var Models = database.models;
var offerWatcher = require('./js/offerWatcher.js');
var currencyValue = require('./js/currency-value.js');

clientTxtUtility.correct();

function getCurrencies() {
  return new Promise(function(fulfill, reject) {
    var url = config.hostUrl + '/currencies';
    $.get(url, function(data) {
      try {
        fulfill(JSON.parse(data));
      } catch(err) {
        reject(err);
      }
    });
  });
}

function setCurrencyImages(container, currencies) {
  var btnTemplate = $('#currency-btn-template');
  for(var i in currencies) {
    var newBtn = $(btnTemplate).clone();

    $(newBtn).removeAttr('id');
    $(newBtn).attr('currency_name', currencies[i].name);
    $(newBtn).attr('currency_id', currencies[i].id);
    var imgName = currencies[i].name;
    imgName = imgName.replace(/ /g, '_');
    $(newBtn).find('.currency-img').attr('src', 'imgs/' + imgName + '.png');
    $(newBtn).show();
    $(container).append(newBtn);
  }
}

function loadCurrencyImages() {
  getCurrencies()
  .then(function(currencies) {
    $('.currency-container').each((i, elem) => {
      setCurrencyImages($(elem), currencies);
    });
  });
}





Emitter.on('clientTxtUpdate', (newLines) => {

});

$(document).ready(() => {


  //Init Functions

  loadCurrencyImages();

  currencyValue.init($);

  var userSettings;

  storage.get('settings')
  .then((settings) => {
    offerWatcher.interval = settings.updateFrequency * 1000 || offerWatcher.interval;
    offerWatcher.start();
    userSettings = settings;
  });

  //Init Functions

  //Global/Modal Functions

  $('.collapse-btn').on('click', function() {
    collapsed = $(this).attr('aria-expanded');
    var glyph = $(this).find('.glyphicon');
    if(collapsed == 'true') {
      $(glyph).removeClass('glyphicon-menu-down');
      $(glyph).addClass('glyphicon-menu-right');
    } else {
      $(glyph).removeClass('glyphicon-menu-right');
      $(glyph).addClass('glyphicon-menu-down');
    }
  });


  $('body').on('click', '#open-client-txt-button', () => {
    clientTxtWatcher.open()
    .then((clientTxtData) => {
      $('#client-txt-location').val(clientTxtData.fileName);
        if(!clientTxtData.result) {
          $('#client-txt-not-found-alert').show();
        } else {
          $('#client-txt-not-found-alert').hide();
        }
      }, throwErr);
  });

  $('#settings-btn').on('click', () => {
    modal.open($, 'settings-modal.html', '#settings-modal', '#settings-modal-btn')
    .then(() => {
      return storage.get('clientTxtLocation');
    }, throwErr)
    .then((clientTxtLocation) => {
      if(typeof clientTxtLocation == 'string') {
        $('#client-txt-location').val(clientTxtLocation);
      }
      clientTxtUtility.check()
      .then((result) => {
        if(!result) {
          $('#client-txt-not-found-alert').show();
        } else {
          $('#client-txt-not-found-alert').hide();
        }
      });
    }, throwErr)
    .then(() => {
      return storage.get('settings');
    })
    .then((settings) => {
      $('#username').val(settings.username);
      $('#api-key').val(settings.apiKey);
      $('#poe-sess-id').val(settings.poeSessId);
      $('#username-whitelist').val(settings.usernameWhitelist);
      $('#update-frequency').val(settings.updateFrequency);
    });
  });

  $('body').on('click', '#save-settings-btn', () => {
    var settings = {
      username: null,
      apiKey: null,
      poeSessId: null,
      usernameWhitelist: [],
      updateFrequency: config.defaultUpdateFrequencyInSeconds,
    };
    settings.username = $('#username').val();
    settings.apiKey = $('#api-key').val().trim();
    settings.poeSessId = $('#poe-sess-id').val().trim();
    settings.usernameWhitelist = $('#username-whitelist').val().split(',');
    settings.updateFrequency = Number($('#update-frequency').val());
    offerWatcher.interval = settings.updateFrequency * 1000;

    settings.username = settings.username !== '' ? settings.username : null;
    settings.apiKey = settings.apiKey !== '' ? settings.apiKey : null;
    settings.poeSessId = settings.poeSessId !== '' ? settings.poeSessId : null;
    for(var i in settings.usernameWhitelist) {
      if(settings.usernameWhitelist[i] === '') {
        settings.usernameWhitelist.splice(i, 1);
      }
    }
    settings.updateFrequency = !isNaN(settings.updateFrequency) ? settings.updateFrequency : config.defaultUpdateFrequencyInSeconds;
    userSettings = settings;
    storage.set('settings', settings);
  });

  storage.get('clientTxtLocationValid')
  .then((result) => {
    if(typeof result != 'boolean' || !result) {
      $('#client-txt-not-found-alert').show();
    } else {
      $('#client-txt-not-found-alert').hide();
    }
  });

  $('body').on('click', '#clear-data-button', () => {
    storage.clear()
    .then(() => {
      return database.clear();
    }, throwErr)
    .then(() => {
      var window = remote.getCurrentWindow();
      remote.app.relaunch();
      window.close();
    }, throwErr);
  });

  $('#tab-bar a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  //./Global/Modal Functions

  //Browse Market Functions

  var selectedMainCurrencyId = 0, selectedAlternateCurrencyId = 0;
  var browseMarketWatchId;

  $('#browse-market-tab-main-currency-container').on('click', '.currency-btn', (e) => {
    selectedMainCurrencyId = $(e.currentTarget).attr('currency_id');
  });
  $('#browse-market-tab-alternate-currency-container').on('click', '.currency-btn', (e) => {
    selectedAlternateCurrencyId = $(e.currentTarget).attr('currency_id');
  });
  $('#load-market-btn').on('click', () => {
    if(browseMarketWatchId) {
      offerWatcher.remove(browseMarketWatchId);
      Emitter.removeListener('offerUpdate ' + browseMarketWatchId, onBrowseMarketOfferUpdate);
    }
    $('#browse-market-buy-container').find('.row').empty();
    $('#browse-market-sell-container').find('.row').empty();
    browseMarketWatchId = offerWatcher.add(selectedMainCurrencyId, selectedAlternateCurrencyId);
    Emitter.on('offerUpdate ' + browseMarketWatchId, onBrowseMarketOfferUpdate);

  });

  function onBrowseMarketOfferUpdate(offers) {
    if(offers.buyOffers) {
      noPrevBuyOffers = false;
      updateOffers('buy', $('#browse-market-buy-offer-list'), offers.buyOffers);
    } else if($('#browse-market-buy-offer-list').children().length < 1) {
      $('#browse-market-buy-offer-list').append('<div style="padding: 5px"><div class="alert alert-info" role="alert">No posted listings.</div></div>');
    }
    if(offers.sellOffers) {
      noPrevSellOffers = false;
      updateOffers('sell', $('#browse-market-sell-offer-list'), offers.sellOffers);
    } else if($('#browse-market-sell-offer-list').children().length < 1) {      
        $('#browse-market-sell-offer-list').append('<div style="padding: 5px"><div class="alert alert-info" role="alert">No posted listings.</div></div>');

    }
  }

  function updateOffers(type, container, offers) {
    var existingOffers = $(container).find('.offer-row');

    var diff;
    if(existingOffers.length && existingOffers.length > offers.length) {
      diff = existingOffers.length - offers.length || offers.length;
      for(let i = diff; i < existingOffers.length; ++i) {
        $(existingOffers[i]).remove();
      }
    } else if(offers.length && existingOffers.length < offers.length) {
      diff = offers.length - existingOffers.length || existingOffers.length;
      for(let i = 0; i < diff; ++i) {
        var newRow = $('#offer-row-template').clone();
        $(newRow).removeAttr('id');
        var currencyElem = currencyValue.newElement($, null, $(newRow).find('.offer-container'));
        var currencyElemUnitPrice = currencyValue.newElement($, null, $(newRow).find('.offer-container-unit-price'));
        $(currencyElem).css('float', 'right');
        $(currencyElemUnitPrice).css('float', 'left');
        $(newRow).show();
        $(container).append(newRow);
      }
    }
    var offerRows = $(container).find('.offer-row');
    var userOffer, userOfferIndex, bestOffer;
    for(var i in offers) {
      var offerRow = offerRows[i];
      var offer = offers[i];
      if(offer.username == settings.username) {
        userOffer = offer;
        userOfferIndex = i;
      }
      if(i === 0) {
        if(!$(offerRow).hasClass('divider-top')) {
          $(offerRow).addClass('divider-top');
        }
      }
      $(offerRow).find('.ign').text(offer.ign);
      $(offerRow).find('.username').text(offer.username);
      var currencyContainer = $(offerRow).find('.offer-container');
      var options = {
        mode: 'currency',
        currency_1_id: offer.sell_currency_id,
        currency_2_id: offer.buy_currency_id,
        junctionMode: 'value-direction',
        direction: 'left',
        lhs_value: +offer.sell_value,
        rhs_value: +offer.buy_value,
      };
      currencyValue.update($, $(currencyContainer), options);

      var currencyContainerUnitPrice = $(offerRow).find('.offer-container-unit-price');
      var currency1Value, currency2Value;
      if(type == 'buy') {
        currency1Value = 1;
        currency2Value = +(offer.sell_value / offer.buy_value).toFixed(4);
      } else if(type == 'sell') {
        currency1Value = +(offer.sell_value / offer.buy_value).toFixed(4);
        currency2Value = 1;

      }
      var unitPriceOptions = {
        mode: 'currency',
        currency_1_id: offer.sell_currency_id,
        currency_2_id: offer.buy_currency_id,
        junctionMode: 'value-direction',
        direction: 'left',
        lhs_value: currency1Value,
        rhs_value: currency2Value,
      };
      currencyValue.update($, $(currencyContainerUnitPrice), unitPriceOptions);
      if(!$(container).find('.owned-offer')) {
        var ownedOfferElem = $('#owned-offer-template').clone();

      }
      if(userOffer) {
        $(container).siblings('.owned-offer').find('.currency-value-container').append($(currencyContainer).find('.currency-value'));
      }
    }

  }

  //./Browse Market Functions

});

