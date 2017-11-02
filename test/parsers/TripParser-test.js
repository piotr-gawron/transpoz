var TripParser = require("../../src/parsers/TripParser");
var Trip = require("../../src/models/Trip");

var fs = require("fs-extra");
var chai = require('chai');
var assert = chai.assert;    // Using Assert style

var helper = require("../helper");


describe("TripParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new TripParser();
      var dataSet, trip;
      return helper.createDataSet({agency: true, calendarService: true, route: true}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/trips/trips.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(4, result.length);
        assert.ok(result[1] instanceof Trip.getClass());
        trip = result[1];
        assert.equal("1_23733753^N+", trip.trip_id);
        // noinspection SpellCheckingInspection
        assert.equal("Franowo", trip.headsign);
        assert.equal("0", trip.direction);
        assert.ok(trip.wheelchairAccess);
        return trip.getRoute();
      }).then(function (route) {
        assert.equal(1, route.route_id);
        return trip.getCalendarService();
      }).then(function (calendarService) {
        assert.equal(1, calendarService.service_id)
      });
    });
    it("invalid", function () {
      var parser = new TripParser();
      return parser.parse("unk column\n1").then(function () {
        assert.false("Exception expected");
      }, function (error) {
        assert.ok(error.message.indexOf("Unknown column") >= 0)
      });
    });
  });
});