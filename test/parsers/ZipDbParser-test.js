var Agency = require("../../src/models/Agency");
var CalendarService = require("../../src/models/CalendarService");
var DataSet = require("../../src/models/DataSet");
var Route = require("../../src/models/Route");
var Stop = require("../../src/models/Stop");
var StopTime = require("../../src/models/StopTime");
var Trip = require("../../src/models/Trip");

var ZipDbParser = require("../../src/parsers/ZipDbParser");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("ZipDbParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    var dataSet;
    it("simple with filename", function () {
      var parser = new ZipDbParser();
      return fs.readFile("testFiles/empty.zip").then(function (data) {
        return parser.parse(data, "testFiles/empty.zip");
      }).then(function (result) {
        dataSet = result;
        assert.ok(dataSet);
        assert.equal(dataSet.name, "empty");
        return Agency.getClass().findAll({
          where: {"dataSetId": dataSet.id}
        });
      }).then(function (agencies) {
        assert.equal(1, agencies.length);
        return CalendarService.getClass().findAll({
          where: {"dataSetId": dataSet.id}
        });
      }).then(function (calendarServices) {
        assert.equal(5, calendarServices.length);
        return Route.getClass().findAll({
          where: {"dataSetId": dataSet.id}
        });
      }).then(function (routes) {
        assert.equal(1, routes.length);
        return Stop.getClass().findAll();
      }).then(function (stops) {
        assert.equal(2, stops.length);
        return StopTime.getClass().findAll({
          where: {"dataSetId": dataSet.id}
        });
      }).then(function (stopTimes) {
        assert.equal(1, stopTimes.length);
        return Trip.getClass().findAll({
          where: {"dataSetId": dataSet.id}
        });
      }).then(function (trips) {
        assert.equal(1, trips.length);
      });
    });

    it("simple without filename", function () {
      var parser = new ZipDbParser();
      return fs.readFile("testFiles/empty.zip").then(function (data) {
        return parser.parse(data);
      }).then(function (dataSet) {
        assert.ok(dataSet);
        assert.equal(dataSet.name, "unknown");
      });
    });
  });
});