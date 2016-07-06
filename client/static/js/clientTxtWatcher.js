var fs = require('fs');
var Emitter = require('./Emitter.js')
var throwErr = require('./throwErr.js')
var storage = require('./storage.js')
var clientTxtUtility = require('./clientTxtUtility.js')


var clientTxtWatcher = {
  watcher: null,
  lastReadClientTxt: null,
  open: openClientTxt,
  watch: initClientTxtWatch,
  stop: () => {
    if(this.watcher) {
      this.watcher.close();
    }
  }
}

function readClientTxt(fileName) {

  return new Promise(function(fulfill, reject) {
    try {
      fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
          reject(err)
        } else {
          fulfill(data);
        }
      });
    } catch(err) {
      reject(err)
    }
  });
} 

function clientTxtUpdate(data) {
  var prevLines = this.lastReadClientTxt.split('\n');
  var currLines = data.split('\n')
  this.lastReadClientTxt = data;
  if(prevLines.length > currLines.length) {
    throwErr(new Error('Current client.txt is smaller than previous client.txt'))
  } else if(prevLines.length < currLines.length) {
    var diff = currLines.length - prevLines.length
    var newLines = currLines.slice(currLines.length - diff, currLines.length);
    Emitter.emit('clientTxtUpdate', newLines);
  }
}

function initClientTxtWatch(fileName) {
  readClientTxt(fileName)
  .then((data) => {

    this.lastReadClientTxt = data;
    this.watcher = fs.watch(fileName, (event, newFileName) => {
      readClientTxt(fileName)
      .then(clientTxtUpdate, throwErr)

    });
  }, throwErr)
}

function openClientTxt() {

  return new Promise(function(fulfill, reject) {
    try {
      var fileNameArr = dialog.showOpenDialog({properties: ['openFile']});
      if(fileNameArr) {
        var fileName = fileNameArr[0] || null;
        if(fileName) {
          storage.set('clientTxtLocation', fileName)
          .then(() => {
            return clientTxtUtility.check();
          }, reject)
          .then((result) => {
            if(result) {
              initClientTxtWatch(fileName)
            }
            fulfill({fileName: fileName, result: result});
          }, reject)
        } else {
          throwErr(new Error('No filename when opening client.txt'))
        }
      }
    } catch(err) {
      reject(err)
    }
  });
  
}

module.exports = clientTxtWatcher;
