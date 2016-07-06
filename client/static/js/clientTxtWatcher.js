var fs = require('fs');
var Emitter = require('./Emitter.js')
var throwErr = require('./throwErr.js')

var lastReadClientTxt;

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
  var prevLines = lastReadClientTxt.split('\n');
  var currLines = data.split('\n')
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

    lastReadClientTxt = data;
    fs.watch(fileName, (event, newFileName) => {
      readClientTxt(fileName)
      .then(clientTxtUpdate, throwErr)

    });
  }, throwErr)
}

function openClientTxt() {
  var fileNameArr = dialog.showOpenDialog({properties: ['openFile']});
  if(fileNameArr) {
    var fileName = fileNameArr[0] || null;
    if(fileName) {
      initClientTxtWatch(fileName);
    } else {
      throwErr(new Error('No filename when opening client.txt'))
    }
  }
}

module.exports = {
  watch: openClientTxt,
}
