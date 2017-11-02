var AgencyParser = require("../../src/parsers/AgencyParser");
var Agency = require("../../src/models/Agency");

var fs = require("fs-extra");

var assert = require("assert");

var helper = require("../helper");


describe("AgencyParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new AgencyParser();
      var dataSet;
      return helper.createDataSet({agency: true}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/agency/agency.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(8, result.length);
        assert.ok(result[0] instanceof Agency.getClass());
        var agency = result[0];
        assert.equal(8, agency.agency_id);
        // noinspection SpellCheckingInspection
        assert.equal("Miejskie Przedsiębiorstwo Komunikacyjne Sp. z o.o. w Poznaniu", agency.name);
        assert.equal("http://www.mpk.poznan.pl", agency.url);
        assert.equal("61 646 33 44", agency.phone);
        assert.equal("pl", agency.language);
      });
    });
    it("invalid", function () {
      var parser = new AgencyParser();
      return parser.parse("unk column\n1").then(function (result) {
        assert.ok(false);
      }, function (error) {
        assert.ok(error.message.indexOf("Unknown column") >= 0)
      });
    });
  });
});