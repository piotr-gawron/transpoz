var express = require('express');
var router = express.Router();

var tripApi = require('./TripApi');
var stopTimeApi = require('./StopTimeApi');

var DataSet = require('../../models/DataSet');

router.route('/:dataSetId').get(function (req, res) {
  return DataSet.getClass().findById(req.params.dataSetId).then(function (dataSet) {
    res.json(dataSet);
  }, function (err) {
    res.send(err);
  });
});

router.route('/').get(function (req, res) {
  return DataSet.getClass().findAll().then(function (dataSets) {
    res.json(dataSets);
  }, function (err) {
    res.send(err);
  });
});

router.use('/:dataSetId/trips', tripApi);
router.use('/:dataSetId/stopTimes', stopTimeApi);

module.exports = router;