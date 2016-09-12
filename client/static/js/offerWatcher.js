var importOffers = require('./importOffers.js');
var shortid = require('shortid')
var Emitter = require('./Emitter.js')

var offerWatcher = {
  start: watch,
  add: addWatch,
  remove: removeWatch,
  stop: stopWatch,
  interval: 5000,
  watchlist: {},
  intervalId: null,
}

function refreshWatch(start) {
  var end = new Date().getTime();
  var waitTime = offerWatcher.interval - (end - start);
  if(offerWatcher.interval > 0 && waitTime > 0) {
    offerWatcher.intervalId = setTimeout(() => {
      watch();
    }, waitTime);
  } else {
    watch();
  }
}

function watch() {
  try {
    var start = new Date().getTime();

    var offerIdList = Object.keys(offerWatcher.watchlist);
    var mainCurrencyIds = [];
    var alternateCurrencyIds = [];

    for(var i in offerIdList) {
      var offerIds= offerIdList[i].split('-');
      var mainCurrencyId = offerIds[0];
      var alternateCurrencyId = offerIds[1];
      mainCurrencyIds.push(mainCurrencyId)
      alternateCurrencyIds.push(alternateCurrencyId)
    }
    if(mainCurrencyIds.length > 0 || alternateCurrencyIds.length > 0) {

      var importPromises = [];
      var joinedIds = mainCurrencyIds.concat(alternateCurrencyIds);

      importOffers({
        online: true,
        want: joinedIds,
        have: joinedIds,
      })
      .then((offers) => {
        Emitter.emit('offerUpdate', offers);
        for(var i in offerWatcher.watchlist) {
          var watchIds = offerWatcher.watchlist[i];
          var offerIds = i.split('-');
          var mainCurrencyId = offerIds[0];
          var alternateCurrencyId = offerIds[1];

          var payload = {
            sellOffers: offers[alternateCurrencyId + '-' + mainCurrencyId],
            buyOffers: offers[mainCurrencyId + '-' + alternateCurrencyId],
          };
          for(var j in watchIds) {
            Emitter.emit('offerUpdate ' + watchIds[j], payload);
          }
        }

        refreshWatch(start);

      }, (err) => {
        console.log(err);
      })
    } else {
      refreshWatch(start);
    }
  } catch(err) {
    console.log('Error in offerWatcher, stopping watch loop')
    console.log(offerWatcher);
    console.log(err.stack)
  }
}

function addWatch(mainCurrencyId, alternateCurrencyId) {
  var watchIds = offerWatcher.watchlist[mainCurrencyId + '-' + alternateCurrencyId];
  var newId = shortid.generate();
  if(watchIds) {
    offerWatcher.watchlist[mainCurrencyId + '-' + alternateCurrencyId].push(newId);
  } else {
    offerWatcher.watchlist[mainCurrencyId + '-' + alternateCurrencyId] = [newId];
  }
  if(offerWatcher.intervalId) {
    clearTimeout(offerWatcher.intervalId)
    offerWatcher.intervalId = null;
    watch();
  }
  return newId;
}

function removeWatch(id) {
  for(var i in offerWatcher.watchlist) {
    var watchIds = offerWatcher.watchlist[i];
    for(var j in watchIds) {
      if(id == watchIds[j]) {
        watchIds.splice(j, 1)
      }
    }
    if(watchIds.length < 1) {
      delete watchIds[i];
    }
  }
}

function stopWatch() {
  offerWatcher.watchlist = {};
}

module.exports = offerWatcher;
