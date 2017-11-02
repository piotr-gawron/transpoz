var Stop = require("../models/Stop");

var CsvParser = require("./CsvParser");

function StopParser() {

}

var knownColumns = [
  {name: "stop_id", field: "id"},
  {name: "stop_code", field: "code"},
  {name: "stop_name", field: "name"},
  {name: "stop_lat", field: "latitude"},
  {name: "stop_lon", field: "longitude"},
  {name: "zone_id", field: "zone"}
];

StopParser.prototype.parse = function (content) {
  return new CsvParser().parse({content: content, knownColumns: knownColumns, modelObject: Stop});
};

module.exports = StopParser;