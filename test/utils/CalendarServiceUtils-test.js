var ZipDbParser = require("../../src/parsers/ZipDbParser");
var CalendarServiceUtils = require("../../src/utils/CalendarServiceUtils");

var fs = require("fs-extra");

var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("CalendarServiceUtils", function () {
  beforeEach(function () {
    return helper.initDbConnection();
  });
  afterEach(function () {
    return helper.closeDbConnection();
  });
  it("simple", function () {
    var parser = new ZipDbParser();
    var dataSet;
    var utils = new CalendarServiceUtils();
    return fs.readFile("testFiles/simple.zip").then(function (data) {
      return parser.parse(data);
    }).then(function (result) {
      dataSet = result;
      return utils.init({dataSet:dataSet});
    }).then(function () {
      assert.equal(1, utils.getIdsByDate("2017-09-18").length);
      assert.equal(0, utils.getIdsByDate("2017-09-06").length);
      assert.equal(1, utils.getIdsByDate("2017-10-18").length);
      assert.equal(1, utils.getIdsByDate("2017-09-20")[0].service_id);
      assert.equal(1, utils.getIdsByDate("2017-09-21")[0].service_id);
      assert.equal(7, utils.getIdsByDate("2017-09-22")[0].service_id);
      assert.equal(3, utils.getIdsByDate("2017-09-23")[0].service_id);
      assert.equal(4, utils.getIdsByDate("2017-09-24")[0].service_id);
      assert.equal(5, utils.getIdsByDate("2017-09-25")[0].service_id);
      assert.equal(1, utils.getIdsByDate("2017-09-26")[0].service_id);
    });
  });

});