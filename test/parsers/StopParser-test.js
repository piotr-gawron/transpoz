var StopParser = require("../../src/parsers/StopParser");
var Stop = require("../../src/models/Stop");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("StopParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new StopParser();
      return fs.readFile("testFiles/stops/stops.txt").then(function (data) {
        return parser.parse(data);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(6, result.length);
        assert.ok(result[1] instanceof Stop.getClass());
        var stop = result[1];
        assert.equal(4, stop.id);
        assert.equal("MT72", stop.code);
        // noinspection SpellCheckingInspection
        assert.equal("Most Teatralny", stop.name);
        assert.equal(52.4107374400, stop.latitude);
        assert.equal(16.9126471700, stop.longitude);
        assert.equal("A", stop.zone);
      });
    });
  });
});