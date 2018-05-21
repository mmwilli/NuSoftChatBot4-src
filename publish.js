var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../nusoftchatbot4-af0f.zip');
var kuduApi = 'https://nusoftchatbot4-af0f.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$nusoftchatbot4-af0f';
var password = '0RoDtg460tgHkwTNfsiRWWWinNn094bsjBgM7snAL9dBDf3iwFhtH9P6Ay7E';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('nusoftchatbot4-af0f publish');
  } else {
    console.error('failed to publish nusoftchatbot4-af0f', err);
  }
});