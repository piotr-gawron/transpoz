var PEKA = require("../../src/travelSystems/PEKA");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("StopUtils", function () {
  before(function () {
    return helper.initDbConnection();
  });
  after(function () {
    return helper.closeDbConnection();
  });
  describe("addTime", function () {
    it("minutes", function () {
      var peka = new PEKA();
      var result =peka.addTime("08:00:00","00:20:00");
      assert.equal("08:20:00", result);
    });

    it("minutes with overflow", function () {
      var peka = new PEKA();
      var result =peka.addTime("07:30:00","00:50:00");
      assert.equal("08:20:00", result);
    });
    it("hours", function () {
      var peka = new PEKA();
      var result =peka.addTime("01:00:00","02:00:00");
      assert.equal("03:00:00", result);
    });
  });

});