var StopTimeParser = require("../../src/parsers/StopTimeParser");
var StopTime = require("../../src/models/StopTime");

var fs = require("fs-extra");
var chai = require('chai');
var assert = chai.assert;    // Using Assert style

var helper = require("../helper");


describe("StopTimeParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new StopTimeParser();
      var dataSet, stopTime;
      return helper.createDataSet({agency: true, calendarService: true, route: true, trip: true, stops:true}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/stop_times/stop_times.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(30, result.length);
        assert.ok(result[1] instanceof StopTime.getClass());
        stopTime = result[1];
        assert.equal("05:29:00", stopTime.arrivalTime);
        assert.equal("05:29:00", stopTime.departureTime);
        assert.equal(1, stopTime.stopSequence);
        // noinspection SpellCheckingInspection
        assert.equal("FRANOWO", stopTime.headsign);
        assert.equal(0, stopTime.pickupType);
        assert.equal(0, stopTime.dropOffType);
        return stopTime.getTrip();
      }).then(function (trip) {
        assert.equal("1_23733751^N+", trip.trip_id);
        return stopTime.getStop();
      }).then(function (stop) {
        assert.equal(1712, stop.id);
      });
    });
  });
});