var ZipDbParser = require("../../src/parsers/ZipDbParser");

var fs = require("fs-extra");

var assert = require("assert");

var helper = require("../helper");


describe("ZipDbParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple with filename", function () {
      var parser = new ZipDbParser();
      return fs.readFile("testFiles/empty.zip").then(function (data) {
        return parser.parse(data, "testFiles/empty.zip");
      }).then(function (dataSet) {
        assert.ok(dataSet);
        assert.equal(dataSet.name, "empty");
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