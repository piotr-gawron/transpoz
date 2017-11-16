var JSZip = require("jszip");

var AgencyParser = require("./AgencyParser");
var CalendarServiceParser = require("./CalendarServiceParser");
var RouteParser = require("./RouteParser");
var StopParser = require("./StopParser");
var StopTimeParser = require("./StopTimeParser");
var TripParser = require("./TripParser");

var DataSet = require("../models/DataSet");

function ZipDbParser() {

}

ZipDbParser.prototype.parse = function (content, filename) {
  var self = this;
  var zip;
  var dataSet;
  return JSZip.loadAsync(content).then(function (result) {
    zip = result;
    return DataSet.create();
  }).then(function (result) {
    dataSet = result;
    if (filename) {
      var name = filename.replace(/^.*[\\\/]/, '');
      if (name.lastIndexOf(".") > 0) {
        name = name.substring(0, name.lastIndexOf('.'));
      }
      dataSet.name = name;
    } else {
      dataSet.name = "unknown";
    }
    return self.parseZipEntry(zip.file("agency.txt"), new AgencyParser(), dataSet);
  }).then(function () {
    return self.parseZipEntry(zip.file("calendar.txt"), new CalendarServiceParser(), dataSet);
  }).then(function () {
    return self.parseZipEntry(zip.file("stops.txt"), new StopParser());
  }).then(function () {
    return self.parseZipEntry(zip.file("routes.txt"), new RouteParser(), dataSet);
  }).then(function () {
    return self.parseZipEntry(zip.file("trips.txt"), new TripParser(), dataSet);
  }).then(function () {
    return self.parseZipEntry(zip.file("stop_times.txt"), new StopTimeParser(), dataSet);
  }).then(function () {
    return dataSet;
  });
};

ZipDbParser.prototype.parseZipEntry = function (zipEntry, parser, dataSet) {
  console.log("Processing: " + zipEntry.name);
  return zipEntry.async("string").then(function (fileContent) {
    return new parser.parse(fileContent, dataSet);
  });
};


module.exports = ZipDbParser;