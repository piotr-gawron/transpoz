var Promise = require('bluebird');
var parse = Promise.promisify(require('csv-parse'));

function CsvParser() {

}

CsvParser.prototype.parse = function (params) {
  var content = params.content;
  var modelObject = params.modelObject;
  var knownColumns = params.knownColumns;
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
        return Promise.reject(new Error("Unknown column in " + modelObject.getClass() + " list: " + header[i]));
      }
      fieldByColumnId[i] = columnId;
    }

    rows.splice(0, 1);
    return Promise.map(rows, function (row) {
      var objectInitialData = {};
      for (j = 0; j < fieldByColumnId.length; j++) {
        if (fieldByColumnId[j] !== null) {
          objectInitialData[fieldByColumnId[j]] = row[j];
        }
      }
      return modelObject.create(objectInitialData);
    });
  });
};

module.exports = CsvParser;