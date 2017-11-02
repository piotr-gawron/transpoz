var Agency = require("../models/Agency");
var Route = require("../models/Route");

var CsvParser = require("./CsvParser");

function RouteParser() {

}

var knownColumns = [
  {name: "route_id", field: "route_id"},
  {name: "agency_id", field: {"name": "agencyId", type: Agency}},
  {name: "route_short_name", field: "shortName"},
  {name: "route_long_name", field: "longName"},
  {name: "route_desc", field: "description"},
  {name: "route_type", field: "type"},
  {name: "route_color", field: "color"},
  {name: "route_text_color", field: "textColor"}
];

RouteParser.prototype.parse = function (content, dataSet) {
  return new CsvParser().parse({
    content: content,
    knownColumns: knownColumns,
    modelObject: Route,
    dataSet: dataSet
  });
};

module.exports = RouteParser;