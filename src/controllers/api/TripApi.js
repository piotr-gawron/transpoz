var express = require('express');
var router = express.Router({mergeParams: true});
var Promise = require('bluebird');

var Trip = require('../../models/Trip');
var StopTime = require('../../models/StopTime');

router.route('/:tripId').get(function (req, res) {
  return Trip.getClass().findAll({
    where: {
      dataSetId: req.params.dataSetId,
      id: req.params.tripId
    }
  }).then(function (trip) {
    res.json(trip);
  }).catch(function (error) {
    console.log(error);
    res.json({error: error.message});
  });
});
router.route('/:tripId/stopTimes').get(function (req, res) {
  return StopTime.getClass().findAll({
    where: {
     dataSetId: req.params.dataSetId,
      tripId: req.params.tripId
    }
  }).then(function (stopTimes) {
    res.json(stopTimes);
  }).catch(function (error) {
    console.log(error);
    res.json({error: error.message});
  });
});

module.exports = router;