var Stop = require("../models/Stop");
var Trip = require("../models/Trip");
var StopTime = require("../models/StopTime");

var CsvParser = require("./CsvParser");

function StopTimeParser() {

}

var knownColumns = [
  {name: "trip_id", field: {"name": "tripId", type: Trip}},
  {name: "stop_id", field: {"name": "stopId", type: Stop, typeField: "id"}},
  {name: "arrival_time", field: "arrivalTime"},
  {name: "departure_time", field: "departureTime"},
  {name: "stop_sequence", field: "stopSequence"},
  {name: "stop_headsign", field: "headsign"},
  {name: "pickup_type", field: "pickupType"},
  {name: "drop_off_type", field: "dropOffType"}
];

StopTimeParser.prototype.parse = function (content, dataSet) {
  return new CsvParser().parse({
    content: content,
    knownColumns: knownColumns,
    modelObject: StopTime,
    dataSet: dataSet
  });
};

module.exports = StopTimeParser;