var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var BestTravelFrom = require('../../algorithms/BestTravelFrom');
var PEKA = require('../../travelSystems/PEKA');
var DataSet = require('../../models/DataSet');

var csvGenerate = Promise.promisify(require('csv-stringify'));

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

function sendCsv(entries, res) {
  var result = [];
  var header = ["StopCode", "Transfers", "Value", "Time"];
  result.push(header);

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var row = [entry.stop.code.replace(/[0-9]/g, ''), entry.transfers, entry.value, entry.time];
    result.push(row);
  }

  return csvGenerate(result).then(function(data){
    res.set('Content-Type', 'text/csv');
    res.send(data);
  });
}

function sendJson(entries, res) {
  var result = [];

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    result.push({stopCode: entry.stop.code.replace(/[0-9]/g, ''), transfers: entry.transfers, value: entry.value, time: entry.time});
  }
  res.json(result);
}

function sendOutput(entries, format, res) {
  var result = [];
  if (format === "csv") {
    return sendCsv(entries, res);
  } else if (format === "json") {
    return sendJson(entries, res);
  } else {
    return Promise.reject("Unknown format: " + format);
  }

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

  var format = req.query.format;
  if (format === undefined) {
    format = "json";
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
      return sendOutput(entries, format, res);
    }).catch(function (error) {
      console.log(error);
      res.json({error: error.message});
    })
  }
});

module.exports = router;