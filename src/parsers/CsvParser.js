var Promise = require('bluebird');
var parse = Promise.promisify(require('csv-parse'));

function CsvParser() {

}

CsvParser.prototype.parse = function (params) {
  var content = params.content;
  var modelObject = params.modelObject;
  var knownColumns = params.knownColumns;
  var dataSet = params.dataSet;
  return parse(content).then(function (data) {
    var i, j;
    var rows = data;
    var header = rows[0];
    var fieldByColumnId = [];
    var transformationFunctions = [];

    for (i = 0; i < header.length; i++) {
      var columnId = undefined;
      var transformationFunction = undefined;
      for (j = 0; j < knownColumns.length; j++) {
        if (knownColumns[j].name === header[i]) {
          columnId = knownColumns[j].field;
          transformationFunction = knownColumns[j].transformationFunction;
        }
      }
      if (columnId === undefined) {
        return Promise.reject(new Error("Unknown column in " + modelObject.getClass() + " list: " + header[i]));
      }
      fieldByColumnId[i] = columnId;
      transformationFunctions[i] = transformationFunction;
    }

    rows.splice(0, 1);
    return Promise.map(rows, function (row) {
      var promises = [];
      var objectInitialData = {};
      if (modelObject.getClass().rawAttributes.dataSetId) {
        if (dataSet === undefined) {
          return Promise.reject(new Error("dataSet must be defined"));
        }
        objectInitialData["dataSetId"] = dataSet.id;
      }
      for (j = 0; j < fieldByColumnId.length; j++) {
        var columnId = fieldByColumnId[j];
        if (columnId !== null) {
          if (typeof columnId === "string") {
            var value = row[j];
            if (transformationFunctions[j] !== undefined) {
              value = transformationFunctions[j](value);
            }
            objectInitialData[columnId] = value;
          } else {
            (function x() {
              var columnType = columnId.type;
              var fieldName = columnId.name;
              var where = {};
              if (columnType.getClass().rawAttributes.dataSetId) {
                where["dataSetId"] = dataSet.id;
              }

              where[header[j]] = row[j];
              var promise = columnType.getClass().findAll({
                where: where
              }).then(function (result) {
                if (result.length !== 1) {
                  return Promise.reject(new Error("Cannot find element for query: " + JSON.stringify(where)));
                } else {
                  objectInitialData[fieldName] = result[0].id;
                }
              });
              promises.push(promise);
            })();
          }
        }
      }
      return Promise.all(promises).then(function () {
        return modelObject.create(objectInitialData);
      });
    });
  });
};

CsvParser.intToBoolean = function (variable) {
  return variable > 0;
};

CsvParser.stringToDate = function (variable) {
  return variable.substr(0, 4) + "-" + variable.substr(4, 2) + "-" + variable.substr(6, 2);
}


module.exports = CsvParser;