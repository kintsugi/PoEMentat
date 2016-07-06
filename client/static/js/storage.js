const storage = require('electron-json-storage');

function get(key) {
  return new Promise(function(fulfill, reject) {
    try {
      storage.get(key, function(err, data) {
        if(err) {
          reject(err)
        } else {
          fulfill(data);
        }
      })
    } catch(err) {
      reject(err)
    }
  });
}

function set(key, value) {
  return new Promise(function(fulfill, reject) {
    try {
      storage.set(key, value, function(err) {
        if(err) {
          reject(err)
        } else {
          fulfill();
        }
      })
    } catch(err) {
      reject(err)
    }
  });
}

module.exports = {
  get: get,
  set: set,
}
