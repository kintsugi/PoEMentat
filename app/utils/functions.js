let request = require('request')
let fs = require('fs')
let jsonfile = require('jsonfile')
const constants = require('../constants')

export function download(uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body) {
      if(err) {
        return reject(err)
      }
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        resolve()
      })
    })
  })
}

export function serializeJSON(filename, obj, options) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(filename, obj, options, (err) => {
      if(err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function getStackSize(item) {
  if(item.properties) {
    for(let prop of item.properties) {
      if(prop.name == 'Stack Size') {
        let stackSizeString = prop.values[0][0]
        let stackSizeFraction = stackSizeString.split('/')
        return parseInt(stackSizeFraction[0])
      }
    }
  }
	return 1
}
