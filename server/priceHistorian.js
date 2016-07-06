var Models = require('./database.js').models;
var Promise = require('promise');
var jStat = require('jStat').jStat;


function getPreviousPrices(options) {
  return new Promise(function(fulfill, reject) {
    try {
      Models.TradeGroups.findOne({
        where: {
          main_currency_id: options.main_currency_id,
          alternate_currency_id: options.alternate_currency_id,
        }
      })
      .then(function(tradeGroup) {
        tradeGroup.getPricings({
          order: 'createdAt ASC'
        })
        .then(fulfill, reject)
      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}

function segmentPrices(prices, segmentLength) {
  var lastTime;
  var segments = [];
  var segment = [];
  for(var i in prices) {
    var price = prices[i];
    if(!lastTime) {
      lastTime = new Date(price.createdAt);
    }
    if(segmentLength < 0) {
      segments.push({
        time: price.createdAt,
        prices: [price],
      })
    }
    else if(new Date(lastTime.getTime() + segmentLength) < price.createdAt) {
      segments.push({
        time: lastTime,
        prices: segment,
      });
      segment = [price];
      lastTime = price.createdAt;
    } else {
      segment.push(price)
    }
  }
  if(segment.length > 0) {
    segments.push({
      time: lastTime,
      prices: segment
    });
  }
  return segments;
}

//gets segments where segment.time > firstTime but < secondTime
function getSegmentsInRange(firstTime, secondTime, segments) {
  var segmentsInRange = [];
  for(var i in segments) {
    var segment = segments[i];
    if(segment.time > firstTime && segment.time < secondTime) {
      segmentsInRange.push(segment);
    }
  }
  return segmentsInRange;
}

function calcDonchian(segments, type, donchianPeriod) {
  var values = [];
  //segments should be in ascending order, [0] is the oldest and [length - 1] is the newest
  //last segment in segments should be the most recent
  //want to find the highest high and the lowest low of the last n perionds
  //where n is the donchian period
  var n = 0;
  for(var i = segments.length - 1; i >= 0  && n < donchianPeriod; --i, ++n) {
    var segment = segments[i];
    for(var j in segment.prices) {
      var price = segment.prices[j]
      values.push(price.get(type + '_mpa') || 0);
    }
  } 
  return {
    lowerDonchian: jStat.min(values) || 0,
    upperDonchian: jStat.max(values) || 0,
  }

}

function calcMovingAverage(segment, segments, type, time) {
  var values = [];
  for(var i in segments) {
    var currentSegment = segments[i];
    if(currentSegment.time >= new Date(segment.time.getTime() - time)) {
      for(var j in segment.prices) {
        var price = segment.prices[j];
        values.push(price.get(type + '_mpa') || 0)
      }
    }
  }
  return jStat.mean(values) || 0;
}

function getVolume(price) {
  return new Promise(function(fulfill, reject) {
    try {
      var buyVolume = price.getBuyOffers(); 
      var sellVolume = price.getSellOffers(); 
      Promise.all([buyVolume, sellVolume])
      .then(function(volumes) {
        try {
          var buy = 0, sell = 0;
          if(volumes[0]) {
            buy = volumes[0].length;
          }
          if(volumes[1]) {
            sell = volumes[1].length;
          }
          fulfill({
            buy: buy,
            sell: sell,
          });
        } catch(err) {
          console.log(err)
        }
      }, function(err) {console.log(err)})
    } catch(err) {
      reject(err)
    }
  });
}

function getVolumes(segment) {
  return new Promise(function(fulfill, reject) {
    try {
      var volumePromises = [];
      for(var i in segment.prices) {
        var price = segment.prices[i];
        volumePromises.push(getVolume(price));
      }
      Promise.all(volumePromises)
      .then(function(volumes) {
        var buy = 0, sell = 0, profit = 0;
        for(var i in volumes) {
          var volume = volumes[i];
          buy += volume.buy;
          sell += volume.sell;
          profit += volume.buy + volume.sell;
        }
        fulfill({
          buy: buy,
          sell: sell,
          profit: profit,
        });
      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}

function calcPoint(segment, segments, type, options) {
  var point = {
    upperDonchian: 0,
    lowerDonchian: 0,
    median: 0,
    medianShadow: 0,
    medianTail: 0,
    fastMovingAvg: 0,
    slowMovingAvg: 0,
    volume: 0,
  }
  var currentSegmentValues = [];
  for(var i in segment.prices) {
    var price = segment.prices[i]
    currentSegmentValues.push(price.get(type + '_mpa') || 0);
  }

  var donchianChannel = calcDonchian(segments, type, options.donchianPeriod)
  point.lowerDonchian = donchianChannel.lowerDonchian;
  point.upperDonchian = donchianChannel.upperDonchian;

  point.median = jStat.median(currentSegmentValues) || 0;
  point.medianShadow = jStat.max(currentSegmentValues) || 0;
  point.medianTail = jStat.min(currentSegmentValues) || 0;

  point.fastMovingAvg = calcMovingAverage(segment, segments, type, options.fastMovingAvgLength);
  point.slowMovingAvg = calcMovingAverage(segment, segments, type, options.slowMovingAvgLength);
  return point;
}

function calcPoints(segment, previousSegments, options) {
  return new Promise(function(fulfill, reject) {
    try {
      var buyPoint = calcPoint(segment, previousSegments, 'buy_max', options)
      var sellPoint = calcPoint(segment, previousSegments, 'sell_min', options)
      var profitPoint = calcPoint(segment, previousSegments, 'profit_margin_min', options)
      getVolumes(segment)
      .then(function(volumes) {
        buyPoint.volume = volumes.buy;
        sellPoint.volume = volumes.sell;
        profitPoint.volume = volumes.profit;
        fulfill({
          time: segment.time,
          buyPoint: buyPoint,
          sellPoint: sellPoint,
          profitPoint: profitPoint,
        });
      }, reject);
    } catch(err) {
      reject(err)
    }
  });
}

function createHistory(prices, options) {
  return new Promise(function(fulfill, reject) {
    try {
      var segments = segmentPrices(prices, options.segmentLength);
      var pointPromises = []
      for(var i = 0; i < segments.length; ++i) {
        var segment = segments[i];
        if(segment.time >= new Date(new Date().getTime() - options.historyLength)) {
          var previousSegments = segments.slice(0, i + 1);
          var pointPromise = calcPoints(segment, previousSegments, options); 
          pointPromises.push(pointPromise);
        }
      }
      Promise.all(pointPromises)
      .then(function(points) {
        var buyPoints = [], sellPoints = [], profitPoints = [];
        for(var i in points) {
          var time = points[i].time;
          var buyPoint = points[i].buyPoint
          var sellPoint = points[i].sellPoint
          var profitPoint = points[i].profitPoint
          buyPoints.push({
            time: time,
            point: buyPoint,
          });
          sellPoints.push({
            time: time,
            point: sellPoint,
          });
          profitPoints.push({
            time: time,
            point: profitPoint,
          });
        }
        fulfill({
          buyPoints: buyPoints,
          sellPoints: sellPoints,
          profitPoints: profitPoints,
        })
      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}


function debugSegments(segments, ifEcho) {
  var debugValues = [];
  for(var i in segments) {
    debugValues.push(debugPrices(segments[i].prices))
  }
  if(ifEcho)
    console.log(debugValues);
  return debugValues
}

function debugPrices(prices, ifEcho) {
  var debugValues = [];
  for(var i in prices) {
    debugValues.push(prices[i].dataValues)
  }
  if(ifEcho)
    console.log(debugValues);
  return debugValues
}

/**
 *  options = {
 *    main_currency_id: id of the main currency
 *    alternate_currency_id: id of the alternate currency
 *    length: Date object represting the amount of time to calculate the history on,
 *    segmentLength: the amount of time one data point on the graph is,
 *    donchianPeriod: the amount of points to calculate the donchian channel on
 *    slowMovingAvgLength: time in milliseconds of the slow moving avg, i.e. 20d
 *    fastMovingAvgLength: time in milliseconds of the fast moving avg, i.e. 5d
 *  }
 */

var Historian = {
  getHistory: function(options) {

    return new Promise(function(fulfill, reject) {
      try {
        getPreviousPrices(options)
        .then(function(prices) {

          return createHistory(prices, options);

        }, reject)
        .then(fulfill, reject);

      } catch(err) {
        reject(err)
      }
    });
  },
}

module.exports = Historian;
