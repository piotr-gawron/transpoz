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
    return Promise.resolve(stopUtils);
  }
}

router.route('/:stopId').get(function (req, res) {
  return getStopUtils().then(function (stopUtils) {
    var stop = stopUtils.getStopById(req.params.stopId);
    res.json(stop);
  }, function (err) {
    res.send(err);
  });
});

router.route('/').get(function (req, res) {
  return getStopUtils().then(function (stopUtils) {
    var stop = stopUtils.getAllStops();
    res.json(stop);
  }, function (err) {
    res.send(err);
  });
});

module.exports = router;