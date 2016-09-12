var throwErr = require('./static/js/throwErr.js');
var Emitter = require('./static/js/Emitter.js')
var request = require('request')
var config = require('./static/js/config')
var storage = require('./static/js/storage.js')

try {
  validateSettings()
  .then(() => {
    Emitter.emit('init complete');
  }, throwErr);
} catch(err) {
  console.log(err.stack);
}

function validateSettings() {
  return new Promise((fulfill, reject) => {
    try {
      storage.get('settings')
      .then((settings) => {

        if(!settings.updateFrequency) {
          settings.updateFrequency = config.defaultUpdateFrequencyInSeconds;
          return storage.set('settings', settings);
        } else {
          fulfill();
        }

      }, reject)
      .then(fulfill, reject)

    } catch(err) {
      reject(err)
    }
  });
}
