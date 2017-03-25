var request = require('request');
var async = require('async');
var currencyValue = require('./currency-value.js');

var poeStashUrl = 'https://www.pathofexile.com/character-window/get-stash-items';

function getStashTabs(username, poeSessId, cb) {
	var stashTabs = [];
	var options = {
		method: 'GET',
		url: poeStashUrl,
		qs: {
			accountName: username,
			tabIndex: 0,
			league: 'Hardcore Legacy',
			tabs: 0
		},
		headers: {
			cookie: 'POESESSID=' + poeSessId + ';',
		}
	};
	//each passes iterates through the passed array, so the passed array will
	//contain the value of the tabIndex to pass to buildUrl in each index
	var iteratorFunc = function(tabIndex, asyncCallback) {
		options.qs.tabIndex = tabIndex;
		request(options, function(err, res, body) {
			if(err)
				asyncCallback(err);
			else {
				var stashTabJson = JSON.parse(body);
				if(stashTabJson.items) {
					stashTabs.push(stashTabJson.items);
          console.log('Grabbed Tab ' + tabIndex);
					asyncCallback()
				} else {
					asyncCallback('No item entry from stash tab ' + tabIndex + ', could be throttled')
				}
			}
		})
	}
	//Request first tab to get the numTabs variable as well as make sure our
	//sessionId is valid. If not, abort, if everything is good, request all tabs
	request(options, function(err, res, body) {
		if(err)
			cb(err);
		else {
			var stashTabJson = JSON.parse(body);
			if(typeof stashTabJson.numTabs !== 'undefined' && stashTabJson.items) {
				var numTabs = stashTabJson.numTabs;
				console.log('Success grabbing header tab, numTabs=' + numTabs + ' Grabbing first 5 tabs.');
				var tabIndexes = [];
				for(var i = 1; i < 6; ++i) {
					tabIndexes.push(i);
        }

				async.eachSeries(tabIndexes, iteratorFunc, function done(err) {
          cb(err, stashTabs);
				});
			} else
				cb('Could not get first stash tab');
		}
	});
}

function getStackSize(item) {
	var props = item.properties;
	for(var i in props) {
		var prop = props[i];
		if(prop.name == 'Stack Size') {
			stackSizeString = prop.values[0][0];
			stackSizeFraction = stackSizeString.split('/');
			return parseInt(stackSizeFraction[0]);
		}
	}
	return 0;
}

function countCurrencies(stashTabs) {
	var currencyCounts = [];
  var currencyNames = [];
  var currencyNameIds = {};

	for(let i in currencyValue.currencyNames) {
    let currencyName = currencyValue.currencyNames[i];
    currencyNames.push(currencyName);
    currencyNameIds[currencyName] = parseInt(i);
		currencyCounts[i] = 0;
	}
	for(let i in stashTabs) {
		var items = stashTabs[i];
		for(let j in items) {
			var item = items[j];
			var name = item.typeLine;
			if(currencyNames.indexOf(name) > -1)
				currencyCounts[currencyNameIds[name]] += getStackSize(item);
		}
	}
	return currencyCounts;
}




module.exports = {

	getCurrencies: function(username, poeSessId) {
    return new Promise((fulfill, reject) =>
    {
      try {
        getStashTabs(username, poeSessId, function(err, stashTabs) {
          currencyCounts = countCurrencies(stashTabs);
          if(err) {
            reject(err);
          } else {
            fulfill(currencyCounts);
          }
        });
      } catch(err) {
        reject(err);
      }
    });
	}
};
