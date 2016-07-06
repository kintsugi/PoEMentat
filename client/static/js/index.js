const {dialog} = require('electron').remote;
var throwErr = require('./js/throwErr.js')
var clientTxtWatcher = require('./js/clientTxtWatcher.js')
var Emitter = require('./js/Emitter.js')

Emitter.on('clientTxtUpdate', (newLines) => {
  console.log(newLines);
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

  $('#open-client-txt-button').on('click', () => {
    clientTxtWatcher.watch();
  })

  
});

