var CalendarService = require("../models/CalendarService");
var Route = require("../models/Route");
var Trip = require("../models/Trip");

var CsvParser = require("./CsvParser");

function TripParser() {

}

var knownColumns = [
  {name: "route_id", field: {"name": "routeId", type: Route}},
  {name: "service_id", field: {"name": "calendarServiceId", type: CalendarService}},
  {name: "trip_id", field: "trip_id"},
  {name: "trip_headsign", field: "headsign"},
  {name: "direction_id", field: "direction"},
  {name: "shape_id", field: null},
  {name: "wheelchair_accessible", field: "wheelchairAccess", transformationFunction: CsvParser.intToBoolean}
];

TripParser.prototype.parse = function (content, dataSet) {
  return new CsvParser().parse({
    content: content,
    knownColumns: knownColumns,
    modelObject: Trip,
    dataSet: dataSet
  });
};

module.exports = TripParser;