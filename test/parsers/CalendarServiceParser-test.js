var CalendarServiceParser = require("../../src/parsers/CalendarServiceParser");
var CalendarService = require("../../src/models/CalendarService");

var fs = require("fs-extra");
var chai = require('chai');
var assert = chai.assert;

var helper = require("../helper");


describe("CalendarServiceParser", function () {
  before(function () {
    return helper.initDbConnection();
  });
  after(function () {
    return helper.closeDbConnection();
  });
  describe("parse", function () {
    it("simple", function () {
      var parser = new CalendarServiceParser();
      var dataSet;
      return helper.createDataSet({agency: true}).then(function (result) {
        dataSet = result;
        return fs.readFile("testFiles/calendar_service/calendar.txt");
      }).then(function (data) {
        return parser.parse(data, dataSet);
      }).then(function (result) {
        assert.ok(result);
        assert.equal(5, result.length);
        assert.ok(result[1] instanceof CalendarService.getClass());
        var calendarService = result[1];
        assert.equal(1, calendarService.service_id);
        assert.notOk(calendarService.monday);
        assert.ok(calendarService.tuesday);
        assert.ok(calendarService.wednesday);
        assert.ok(calendarService.thursday);
        assert.notOk(calendarService.friday);
        assert.notOk(calendarService.saturday);
        assert.notOk(calendarService.sunday);
        assert.equal("2017-09-06", calendarService.startDate);
        assert.equal("2017-09-17", calendarService.endDate);
      });
    });
    it("invalid", function () {
      var parser = new CalendarServiceParser();
      return parser.parse("unk column\n1").then(function () {
        assert.notOk("Exception expected");
      }, function (error) {
        assert.ok(error.message.indexOf("Unknown column") >= 0)
      });
    });
  });
});