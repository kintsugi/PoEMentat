const {dialog} = require('electron').remote;
var fs = require('fs');
var throwErr = require('./js/throwErr.js')
var clientTxtWatcher = new require('./js/clientTxtWatcher.js');
var Emitter = require('./js/Emitter.js')
var modal = require('./js/modal.js')
var storage = require('./js/storage.js')
var clientTxtUtility = require('./js/clientTxtUtility.js')

clientTxtUtility.correct();

Emitter.on('clientTxtUpdate', (newLines) => {

})

$(document).ready(function(){

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
      console.log(clientTxtData)
      $('#client-txt-location').val(clientTxtData.name)
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
  })

  storage.get('clientTxtLocationValid')
  .then((result) => {
    if(!result) {
      $('#client-txt-not-found-alert').show();
    } else {
      $('#client-txt-not-found-alert').hide();
    }
  })

  $('body').on('click', '#clear-data-button', () => {
    storage.clear();
  });
  
});

