var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var Stop = require('../../models/Stop');
var StopUtils = require('../../utils/StopUtils');


var stopUtils;

function getStopUtils() {
  if (stopUtils === undefined) {
    var result = new StopUtils();
    return result.init().then(function () {
      stopUtils = result;
      return result;
    });
  } else {
    console.log("ok");
    return Promise.resolve(stopUtils);
  }
}

router.route('/:code').get(function (req, res) {
  return getStopUtils().then(function (stopUtils) {
    var stop = stopUtils.getStopsForCode(req.params.code);
    res.json(stop);
  }, function (err) {
    res.send(err);
  });
});

router.route('/').get(function (req, res) {
  return getStopUtils().then(function (stopUtils) {
    var prefixes = stopUtils.getStopPrefixes();
    var result = [];
    for (var i = 0; i < prefixes.length; i++) {
      var code = prefixes[i];
      var name = stopUtils.getStopsForCode(code)[0].name;
      result.push({code: code, name: name});
    }
    res.json(result);
  }, function (err) {
    res.send(err);
  });
});

module.exports = router;