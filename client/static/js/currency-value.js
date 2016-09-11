var Models = require('../../database.js').models;

var currencyValue = {
  init: init,
  newElement: newElement, 
  update: updateCurrencyValue,
  currencyNames: {}
}

function init($) {
  Models.CurrencyTypes.findAll({})
  .then((currencyTypes) => {
    for(var i in currencyTypes) {
      var currency = currencyTypes[i];
      currencyValue.currencyNames[currency.id] = currency.name;
    }
  })
}

var alertString = '<div class="alert" role="alert"></div>'
var leftDirectionString = ' <span class="glyphicon glyphicon-sort-by-attributes value-direction-left" aria-hidden="true"></span> '
var rightDirectionString = ' <span class="glyphicon glyphicon-sort-by-attributes value-direction-right" aria-hidden="true"></span> '


function updateCurrencyValue($, elem, options) {
  if(!options) {
    options = getOptions($, elem);
  }
  if(options.mode == 'alert') {
    $(elem).find('.currency-1').hide();
    $(elem).find('.currency-2').hide();
    $(elem).find('.junction').hide();

    $(elem).find('.alert-only').empty();
    $(elem).find('.alert-only').show();

    var alert = $.parseHTML(alertString);
    $(alert).addClass(options.alert-type);
    $(alert).html(options.alert-text);

    $(elem).find('.alert-only').append(alert);

  } else if(options.mode == 'currency') {
    var currencyName1 = currencyValue.currencyNames[options.currency_1_id],
      currencyName2 = currencyValue.currencyNames[options.currency_2_id];
    currencyName1 = currencyName1.replace(/ /g, '_');
    currencyName2 = currencyName2.replace(/ /g, '_');
      

    $(elem).find('.currency-1').find('img').attr('src', 'imgs/' + currencyName1 + '.png')
    $(elem).find('.currency-2').find('img').attr('src', 'imgs/' + currencyName2 + '.png')
    $(elem).find('.junction').empty();

    if(options.junctionMode == 'alert') {
      var alert = $.parseHTML(alertString);
      $(alert).addClass(options.junction-alert-type);
      $(alert).html(options.junction-alert-text);
      $(elem).find('.junction').append(alert);

    } else if(options.junctionMode == 'value-direction') {
      var direction;
      if(options.direction == 'right') {
        direction = rightDirectionString
      } else if(options.direction == 'left') {
        direction = leftDirectionString
      }
      $(elem).find('.junction').html(options.lhs_value + direction + options.rhs_value);
    }
  }
  return elem;
}

function updateCurrencyValueEvent(e, options) {
  if(options) {
    setOptions(this, options)
  }
  updateCurrencyValue($, this, options)
}

function setOptions($, elem, options) {
  $(elem).attr('mode', options.mode);
  $(elem).attr('currency_1_id', options.currency_1_id);
  $(elem).attr('currency_2_id', options.currency_2_id);
  $(elem).attr('alert-type', options.alertType);
  $(elem).attr('alert-text', options.alertText);
  $(elem).attr('junction-mode', options.junctionMode);
  $(elem).attr('direction', options.direction);
  $(elem).attr('lhs_value', options.lhs_value);
  $(elem).attr('rhs_value', options.rhs_value);
  $(elem).attr('junction-alert-type', options.junctionAlertType);
  $(elem).attr('junction-alert-text', options.junction);
}

function getOptions($, elem) {
  return {
    mode: $(elem).attr('mode'),
    currency_1_id: $(elem).attr('currency_1_id'),
    currency_2_id: $(elem).attr('currency_2_id'),
    alertType: $(elem).attr('alert-type'),
    alertText: $(elem).attr('alert-text'),
    junctionMode: $(elem).attr('junction-mode'),
    direction: $(elem).attr('direction'),
    lhs_value: $(elem).attr('lhs_value'),
    rhs_value: $(elem).attr('rhs_value'),
    junctionAlertType: $(elem).attr('junction-alert-type'),
  };
}

function newElement($, options, container) {
  var newElem = $('#currency-value-template').clone();
  $(newElem).removeAttr('id');
  if(options) {
    setOptions($, newElem, options);
  }
  newElem = updateCurrencyValue($, newElem);
  $(newElem).show();
  if(container) {
    $(container).append(newElem);
  }
  return newElem;
}

module.exports = currencyValue;
