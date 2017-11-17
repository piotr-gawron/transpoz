var BestTravelFrom = require("../../src/algorithms/BestTravelFrom");
var PEKA = require("../../src/travelSystems/PEKA");

var ZipDbParser = require("../../src/parsers/ZipDbParser");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var helper = require("../helper");


describe("BestTravelFrom", function () {
  beforeEach(function () {
    return helper.initDbConnection();
  });
  afterEach(function () {
    return helper.closeDbConnection();
  });
  describe("getBestFrom", function () {
    it("basic", function () {
      var parser = new ZipDbParser();
      var bestTravelFrom;
      var dataSet;
      var peka = new PEKA();
      return fs.readFile("testFiles/empty.zip").then(function (data) {
        return parser.parse(data);
      }).then(function (result) {
        dataSet = result;
        bestTravelFrom = new BestTravelFrom({dataSet: dataSet, travelSystem: peka});
        return bestTravelFrom.init();
      }).then(function () {
        // noinspection SpellCheckingInspection
        var result = bestTravelFrom.getBestFrom({stopCode: "FRWO", time: "08:00:00"});
        assert.equal(2, result.length);
      });
    });
    it("invalid stop code", function () {
      var parser = new ZipDbParser();
      var bestTravelFrom;
      var dataSet;
      var peka = new PEKA();
      return fs.readFile("testFiles/empty.zip").then(function (data) {
        return parser.parse(data);
      }).then(function (result) {
        dataSet = result;
        bestTravelFrom = new BestTravelFrom({dataSet: dataSet, travelSystem: peka});
        return bestTravelFrom.init();
      }).then(function () {
        expect(function () {
          bestTravelFrom.getBestFrom({stopCode: "X", time: "08:00:00"})
        }).to.throw();
      });
    });
    it("simple", function () {
      var parser = new ZipDbParser();
      var bestTravelFrom;
      var dataSet;
      var peka = new PEKA();
      return fs.readFile("testFiles/simple.zip").then(function (data) {
        return parser.parse(data);
      }).then(function (result) {
        dataSet = result;
        bestTravelFrom = new BestTravelFrom({dataSet: dataSet, travelSystem: peka});
        return bestTravelFrom.init();
      }).then(function () {
        var result = bestTravelFrom.getBestFrom({
          stopCode: "A1",
          time: "08:50:00",
          date: "2017-09-19",
          fullStopList: true
        });
        assert.equal(14, result.length);
        result = bestTravelFrom.getBestFrom({
          stopCode: "A1",
          time: "08:50:00",
          date: "2017-09-19",
          fullStopList: false
        });
        assert.equal(8, result.length);
        for (var i = 0; i < 8; i++) {
          assert.ok(result[i]);
          assert.ok(result[i].time);
        }
      });
    });
  });
});