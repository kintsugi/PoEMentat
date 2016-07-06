const {dialog} = require('electron').remote;
var fs = require('fs');
var throwErr = require('./js/throwErr.js')
var clientTxtWatcher = new require('./js/clientTxtWatcher.js');
var Emitter = require('./js/Emitter.js')
var modal = require('./js/modal.js')
var storage = require('./js/storage.js')
var clientTxtUtility = require('./js/clientTxtUtility.js')
var config = require('./js/config.js')

clientTxtUtility.correct();

function getCurrencies() {
  return new Promise(function(fulfill, reject) {
    var url = config.hostUrl + '/currencies'
    $.get(url, function(data) {
      try {
        fulfill(JSON.parse(data))
      } catch(err) {
        reject(err);
      }
    })
  });
}

function setCurrencyImages(container, currencies) {
  var btnTemplate = $('#currency-btn-template');
  for(var i in currencies) {
    var newBtn = $(btnTemplate).clone();

    $(newBtn).removeAttr('id');
    $(newBtn).attr('currency_name', currencies[i].name)
    $(newBtn).attr('currency_id', currencies[i].id)
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
    console.log(currencies)
    $('.currency-container').each((i, elem) => {

      setCurrencyImages($(elem), currencies)
    })
  })
}


Emitter.on('clientTxtUpdate', (newLines) => {

})

$(document).ready(function(){

  loadCurrencyImages();

  $('.collapse-btn').on('click', function() {
    collapsed = $(this).attr('aria-expanded')
    var glyph = $(this).find('.glyphicon');
    if(collapsed == 'true') {
      $(glyph).removeClass('glyphicon-menu-down')
      $(glyph).addClass('glyphicon-menu-right')
    } else {
      $(glyph).removeClass('glyphicon-menu-right')
      $(glyph).addClass('glyphicon-menu-down')
    }
  })

  $('body').on('click', '#open-client-txt-button', () => {
    clientTxtWatcher.open()
    .then((clientTxtData) => {
      $('#client-txt-location').val(clientTxtData.fileName)
        if(!clientTxtData.result) {
          $('#client-txt-not-found-alert').show();
        } else {
          $('#client-txt-not-found-alert').hide();
        }
      }, throwErr)
  })

  $('#settings-btn').on('click', () => {
    modal.open($, 'settings-modal.html', '#settings-modal', '#settings-modal-btn')
    .then(() => {
      return storage.get('clientTxtLocation')
    }, throwErr)
    .then((clientTxtLocation) => {
      if(typeof clientTxtLocation == 'string') {
        console.log('setting value')
        $('#client-txt-location').val(clientTxtLocation)
      }
      clientTxtUtility.check()
      .then((result) => {
        if(!result) {
          $('#client-txt-not-found-alert').show();
        } else {
          $('#client-txt-not-found-alert').hide();
        }
      })
    }, throwErr)
    .then(() => {
      return storage.get('settings');
    })
    .then((settings) => {
      $('#username').val(settings.username);
      $('#api-key').val(settings.apiKey);
      $('#poe-sess-id').val(settings.poeSessId);
      $('#username-whitelist').val(settings.usernameWhitelist);
    })
  })

  $('body').on('click', '#save-settings-btn', () => {
    var settings = {
      username: null,
      apiKey: null,
      poeSessId: null,
      usernameWhitelist: [],
    }
    settings.username = $('#username').val();
    settings.apiKey = $('#api-key').val().trim();
    settings.poeSessId = $('#poe-sess-id').val().trim();
    settings.usernameWhitelist = $('#username-whitelist').val().split(',');
    storage.set('settings', settings);
  });

  storage.get('clientTxtLocationValid')
  .then((result) => {
    if(typeof result != 'boolean' || !result) {
      $('#client-txt-not-found-alert').show();
    } else {
      $('#client-txt-not-found-alert').hide();
    }
  })

  $('body').on('click', '#clear-data-button', () => {
    storage.clear();
  });

  $('#tab-bar a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

});

