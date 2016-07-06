var storage = require('./storage.js')

function checkClientTxtLocation() {
  return new Promise(function(fulfill, reject) {
    try {
      storage.get('clientTxtLocation')
      .then((clientTxtLocation) => {
        console.log(clientTxtLocation)
        fs.stat(clientTxtLocation, function(err, stat) {
          console.log(err)
          if(!err) {
            return storage.set('clientTxtLocationValid', true)
          } else {
            return storage.set('clientTxtLocationValid', false)
          }
        })
      })
      .then(() => {
        fulfill(storage.get('clientTxtLocationValid'))
      })
    } catch(err) {
      reject(err)
    }
  });
}

function correctClientTxtLocation() {
  storage.get('clientTxtLocation')
  .then((clientTxtLocation) => {
    if(typeof clientTxtLocation == 'string') {
      checkClientTxtLocation()
      .then((result) => {
        storage.set('clientTxtLocationValid', result);
      })
    } else {
      storage.set('clientTxtLocation', 'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt')
      .then(() => {
        return checkClientTxtLocation();
      })
      .then((result) => {
        storage.set('clientTxtLocationValid', result);
      })

    }

  })
}

module.exports = {
  check: checkClientTxtLocation,
  correct: correctClientTxtLocation,
}
