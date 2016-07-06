
var selectedMainCurrencyId = 0, selectedAlternateCurrencyId = 0;

function getCurrencies() {
  return new Promise(function(fulfill, reject) {
    $.get('/currencies', function(data) {
      try {
        fulfill(JSON.parse(data))
      } catch(err) {
        reject(err);
      }
    })
  });
}

function getHistory(options) {
  var params = $.param(options);

  return new Promise(function(fulfill, reject) {
    try {
      $.get('/history?' + params, function(data) {
        fulfill(JSON.parse(data));
      })
    } catch(err) {
      reject(err)
    }
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
    setCurrencyImages($('#main-currency-container'), currencies);
    setCurrencyImages($('#alternate-currency-container'), currencies);
  })
}

function createGraph(points, location) {

  var margin = {top: 30, right: 150, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom,
    barHeight = height * 0.3;


  var parseDate = d3.time.format.iso.parse;
  var mpaDomain = [];
  var volumeDomain = [];
  for(var i in points) {
    if(!points[i].point.slowMovingAvg) {
      points.splice(i, 1);
    }
  }
  for(var i in points) {
    points[i].time = parseDate(points[i].time) 
    mpaDomain.push(points[i].point.slowMovingAvg)
    mpaDomain.push(points[i].point.fastMovingAvg)
    mpaDomain.push(points[i].point.median)
    mpaDomain.push(points[i].point.medianShadow)
    mpaDomain.push(points[i].point.medianTail)
    mpaDomain.push(points[i].point.upperDonchian)
    mpaDomain.push(points[i].point.lowerDonchian)
    volumeDomain.push(points[i].point.volume)
  }
  mpaDomain.sort();
  volumeDomain.sort();

  // Set the ranges
  var x = d3.time.scale().range([0, width])

  var y = d3.scale.linear()
  .domain([mpaDomain[0], mpaDomain[mpaDomain.length - 1]])
  .range([height, 0]);
  var volumeScale = d3.scale.linear()
  .domain([volumeDomain[0], volumeDomain[volumeDomain.length - 1]])
  .range([barHeight, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  var volumeAxis = d3.svg.axis()
  .scale(volumeScale)
  .orient("right")
  .ticks(5);

  var fastLine = d3.svg.line()
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return y(d.point.fastMovingAvg);
  });

  var slowLine = d3.svg.line()
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return y(d.point.slowMovingAvg);
  });
  var medianLine = d3.svg.line()
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return y(d.point.median);
  });

  var volumeBar = d3.svg.line()
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return height - volumeScale(d.point.volume);
  })
  .interpolate('step-after')


  var svg = d3.select("#" + location).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(points, function(d) {
    return d.time;
  }));

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)

  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + width + " ," + (height - barHeight) + ")")	
  .call(volumeAxis)

  svg.append("path")
  .datum(points)
  .attr("class", "line slowLine")
  .attr("d", slowLine);

  svg.append("path")
  .datum(points)
  .attr("class", "line fastLine")
  .attr("d", fastLine);

  svg.append("path")
  .datum(points)
  .attr("class", "line medianLine")
  .attr("d", medianLine);

  svg.append('path')
  .datum(points)
  .attr('class', 'line volumeBar')
  .attr('d', volumeBar)

}

function getGraphs() {
  if(selectedMainCurrencyId != 0 && selectedAlternateCurrencyId != 0) {
    getHistory({
      main_currency_id: selectedMainCurrencyId,
      alternate_currency_id: selectedAlternateCurrencyId,
      historyLength: 1000*60*60*24, 
      segmentLength: -1,
      donchianPeriod: 5,
      slowMovingAvgLength: 1000*60*30,
      fastMovingAvgLength: 1000*60*15,
    })
    .then(function(history) {
      try {
        console.log(history)
        $('.currency-graph').empty();
        createGraph(history.buyPoints, 'buyGraph')
        createGraph(history.sellPoints, 'sellGraph')
        createGraph(history.profitPoints, 'profitGraph')
      } catch(err) {
        throw err
      }
    })
  }
}

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

  $('#main-currency-container').on('click', '.currency-btn', function() {
    selectedMainCurrencyId = $(this).attr('currency_id');
    getGraphs();
  })

  $('#alternate-currency-container').on('click', '.currency-btn', function() {
    selectedAlternateCurrencyId = $(this).attr('currency_id');
    getGraphs();
  })

});
