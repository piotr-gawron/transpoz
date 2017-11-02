var CalendarService = require("../models/CalendarService");

var CsvParser = require("./CsvParser");

function CalendarServiceParser() {

}

var knownColumns = [
  {name: "service_id", field: "service_id"},
  {name: "monday", field: "monday", transformationFunction: CsvParser.intToBoolean},
  {name: "tuesday", field: "tuesday", transformationFunction: CsvParser.intToBoolean},
  {name: "wednesday", field: "wednesday", transformationFunction: CsvParser.intToBoolean},
  {name: "thursday", field: "thursday", transformationFunction: CsvParser.intToBoolean},
  {name: "friday", field: "friday", transformationFunction: CsvParser.intToBoolean},
  {name: "saturday", field: "saturday", transformationFunction: CsvParser.intToBoolean},
  {name: "sunday", field: "sunday", transformationFunction: CsvParser.intToBoolean},
  {name: "start_date", field: "startDate", transformationFunction: CsvParser.stringToDate},
  {name: "end_date", field: "endDate", transformationFunction: CsvParser.stringToDate}
];

CalendarServiceParser.prototype.parse = function (content, dataSet) {
  return new CsvParser().parse({
    content: content,
    knownColumns: knownColumns,
    modelObject: CalendarService,
    dataSet: dataSet
  });
};

module.exports = CalendarServiceParser;