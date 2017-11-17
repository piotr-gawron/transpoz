var express = require('express');
var router = express.Router({mergeParams: true});
var Promise = require('bluebird');

var StopTime = require('../../models/StopTime');

router.route('/:stopTimeId').get(function (req, res) {
  return StopTime.getClass().findAll({
    where: {
      dataSetId: req.params.dataSetId,
      id: req.params.stopTimeId
    }
  }).then(function (stopTime) {
    res.json(stopTime);
  }).catch(function (error) {
    console.log(error);
    res.json({error: error.message});
  });
});


module.exports = router;