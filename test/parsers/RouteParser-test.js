var RouteParser = require("../../src/parsers/RouteParser");
var Agency = require("../../src/models/Agency");
var Route = require("../../src/models/Route");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("RouteParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new RouteParser();
      var dataSet;
      return helper.createDataSet({agency: true}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/routes/routes.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(3, result.length);
        assert.ok(result[0] instanceof Route.getClass());
        var route = result[0];
        assert.equal(1, route.route_id);
        assert.equal("1", route.shortName);
        // noinspection SpellCheckingInspection
        assert.equal("JUNIKOWO - FRANOWO|FRANOWO - JUNIKOWO", route.longName);
        assert.ok(route.description);
        assert.equal(0, route.type);
        assert.equal("D0006F", route.color);
        assert.equal("FFFFFF", route.textColor);
        return route.getAgency();
      }).then(function (agency) {
        assert.ok(agency instanceof Agency.getClass());
      });
    });
    it("undefined dataSet", function () {
      var parser = new RouteParser();
      return fs.readFile("testFiles/routes/routes.txt").then(function (data) {
        return parser.parse(data);
      }).then(function () {
        assert.notOk("Exception expected");
      }, function (error) {
        console.log(error.message);
        assert.ok(error.message.indexOf("dataSet must be defined") >= 0);
      });
    });
    it("unknown agency", function () {
      var parser = new RouteParser();
      var dataSet;
      return helper.createDataSet({agency: false}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/routes/routes.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function () {
        assert.notOk("Exception expected");
      }, function (error) {
        assert.ok(error.message.indexOf("Cannot find element") >= 0);
      });
    });
  });
});