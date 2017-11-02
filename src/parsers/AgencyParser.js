var Agency = require("../models/Agency");

var Promise = require('bluebird');
var parse = Promise.promisify(require('csv-parse'));

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
  return parse(content).then(function (data) {
    var i, j;
    var rows = data;
    var header = rows[0];
    var fieldByColumnId = [];

    for (i = 0; i < header.length; i++) {
      var columnId = undefined;
      for (j = 0; j < knownColumns.length; j++) {
        if (knownColumns[j].name === header[i]) {
          columnId = knownColumns[j].field;
        }
      }
      if (columnId === undefined) {
        return Promise.reject(new Error("Unknown column in agency list: " + header[i]));
      }
      fieldByColumnId[i] = columnId;
    }

    rows.splice(0, 1);
    return Promise.map(rows, function (row) {
      var agencyInitialData = {};
      for (j = 0; j < fieldByColumnId.length; j++) {
        if (fieldByColumnId[j] !== null) {
          agencyInitialData[fieldByColumnId[j]] = row[j];
        }
      }
      return Agency.create(agencyInitialData);
    });
  });
};

module.exports = AgencyParser;