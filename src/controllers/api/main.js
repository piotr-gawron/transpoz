var express = require('express');
var router = express.Router();
var dataSetApi = require('./DataSetApi');
var stopApi = require('./StopApi');
var travelApi = require('./TravelApi');
var unifiedStopApi = require('./UnifiedStopApi');

router.get('/', function (req, res) {
  res.json({message: 'transpoz API!'});
});

router.use('/dataSets', dataSetApi);
router.use('/stops', stopApi);
router.use('/travels', travelApi);
router.use('/unifiedStops', unifiedStopApi);

module.exports = router;