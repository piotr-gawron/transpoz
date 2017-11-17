var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var BestTravelFrom = require('../../algorithms/BestTravelFrom');
var PEKA = require('../../travelSystems/PEKA');
var DataSet = require('../../models/DataSet');

var bestTravelFrom = {};

function getBestTravelFrom(params) {
  var query = params.travelSystem + "\n" + params.dataSetId + "\n" + params.type;
  var result = bestTravelFrom[query];

  if (result !== undefined) {
    return Promise.resolve(result);
  }

  var travelSystem;
  if (params.travelSystem === "PEKA") {
    travelSystem = new PEKA();
  } else {
    return Promise.reject(new Error("Unknown travel system: " + params.travelSystem));
  }

  return DataSet.getClass().findById(params.dataSetId).then(function (dataSet) {
    result = new BestTravelFrom({dataSet: dataSet, travelSystem: travelSystem});
    return result.init();
  }).then(function () {
    bestTravelFrom[query] = result;
    return result;
  });

}

router.route('/bestTravel').get(function (req, res) {
  var errors = [];
  var type = req.query.type;
  if (type === undefined) {
    type = "MONEY";
  }
  var date = req.query.date;
  if (date === undefined) {
    errors.push("Date is not defined");
  }
  var hour = req.query.hour;
  if (hour === undefined) {
    errors.push("Hour is not defined");
  }
  var dataSetId = req.query.dataSetId;
  if (dataSetId === undefined) {
    errors.push("DataSet is not defined");
  }
  var stopCode = req.query.stopCode;
  if (stopCode === undefined) {
    errors.push("StopCode is not defined");
  }
  var travelSystem = req.query.travelSystem;
  if (travelSystem === undefined) {
    travelSystem = "PEKA";
  }

  if (errors.length > 0) {
    res.json({errors: errors});
  } else {
    return getBestTravelFrom({
      type: type,
      travelSystem: travelSystem,
      dataSetId: dataSetId
    }).then(function (bestTravelFrom) {
      var entries = bestTravelFrom.getBestFrom({
        stopCode: stopCode,
        time: hour,
        date: date
      });
      var result = [];
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        result.push({stopCode: entry.stop.code, transfers: entry.transfers, value: entry.value, time: entry.time});
      }
      res.json(result);
    }).catch(function (error) {
      console.log(error);
      res.json({error: error.message});
    })
  }
});

module.exports = router;