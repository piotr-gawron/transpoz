var Agency = require("../models/Agency");

var CsvParser = require("./CsvParser");

function AgencyParser() {

}

var knownColumns = [
  {name: "agency_id", field: "agency_id"},
  {name: "agency_name", field: "name"},
  {name: "agency_url", field: "url"},
  {name: "agency_timezone", field: null},
  {name: "agency_phone", field: "phone"},
  {name: "agency_lang", field: "language"}
];

AgencyParser.prototype.parse = function (content) {
  return new CsvParser().parse({content: content, knownColumns: knownColumns, modelObject: Agency});
};

module.exports = AgencyParser;