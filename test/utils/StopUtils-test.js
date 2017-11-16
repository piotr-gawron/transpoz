var StopParser = require("../../src/parsers/StopParser");
var StopUtils = require("../../src/utils/StopUtils");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("StopUtils", function () {
  beforeEach(function () {
    return helper.initDbConnection();
  });
  afterEach(function () {
    return helper.closeDbConnection();
  });
  it("getStopsForCode", function () {
    var parser = new StopParser();
    var utils = new StopUtils();
    return fs.readFile("testFiles/stops/stops.txt").then(function (data) {
      return parser.parse(data);
    }).then(function () {
      return utils.init();
    }).then(function () {
      assert.equal(3, utils.getStopsForCode("MT72").length);
      assert.equal(3, utils.getStopsForCode("MT44").length);
      assert.equal(2, utils.getStopsForCode("POZN41").length);
      assert.equal(1, utils.getStopsForCode("FRWO41").length);
    });
  });
  it("init invalid", function () {
    var parser = new StopParser();
    var utils = new StopUtils();
    return fs.readFile("testFiles/stops/invalid_stops.txt").then(function (data) {
      return parser.parse(data);
    }).then(function () {
      return utils.init();
    }).then(function () {
      assert.notOk("Exception expected");
    }, function (error) {
      assert.ok(error.message.indexOf("Two different names for prefix") >= 0);
    });
  });
  it("getUnifiedStops", function () {
    var parser = new StopParser();
    var utils = new StopUtils();
    return fs.readFile("testFiles/stops/stops.txt").then(function (data) {
      return parser.parse(data);
    }).then(function () {
      return utils.init();
    }).then(function () {
      assert.equal(3, utils.getUnifiedStops().length);
    });
  });
});