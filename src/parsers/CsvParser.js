var Promise = require('bluebird');
var parse = Promise.promisify(require('csv-parse'));

function CsvParser() {
  this._cachedData = {};
}

CsvParser.prototype.parse = function (params) {
  var self = this;
  var content = params.content;
  var modelObject = params.modelObject;
  var knownColumns = params.knownColumns;
  var dataSet = params.dataSet;

  var columnByColumnId = [];
  var objectsToCreate = [];
  var rows;
  return parse(content).then(function (data) {
    var i, j;
    rows = data;
    var header = rows[0];
    var promises = [];


    for (i = 0; i < header.length; i++) {
      var column = undefined;
      var transformationFunction = undefined;
      for (j = 0; j < knownColumns.length; j++) {
        if (knownColumns[j].name === header[i]) {
          column = knownColumns[j];
        }
      }
      if (column === undefined) {
        return Promise.reject(new Error("Unknown column in " + modelObject.getClass() + " list: " + header[i]));
      }
      columnByColumnId[i] = column;

      if (column.field !== null && typeof column.field !== "string") {
        promises.push(self.getDataForColumn(column, dataSet));
      }
    }
    return Promise.all(promises);
  }).then(function () {
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row.length > 1) {
        var objectInitialData = {};
        if (modelObject.getClass().rawAttributes.dataSetId) {
          if (dataSet === undefined) {
            return Promise.reject(new Error("dataSet must be defined"));
          }
          objectInitialData["dataSetId"] = dataSet.id;
        }
        for (j = 0; j < columnByColumnId.length; j++) {
          var column = columnByColumnId[j];
          if (column.field !== null) {
            var value = row[j];
            if (typeof column.field === "string") {
              if (column.transformationFunction !== undefined) {
                value = column.transformationFunction(value);
              }
              objectInitialData[column.field] = value;
            } else {
              objectInitialData[column.field.name] = self.getDataForRow(column, value);
            }
          }
        }
        objectsToCreate.push(objectInitialData);
      }
    }
    var validatePromise = Promise.resolve();
    if (objectsToCreate.length > 0) {
      if (objectsToCreate[0].id !== undefined) {
        validatePromise = self.validate(objectsToCreate, modelObject);
      }
    }
    return validatePromise;
  }).then(function () {
    console.log("Create " + modelObject.getClass().getTableName());
    return modelObject.bulkCreate(objectsToCreate, {raw: true});
  });
};

CsvParser.prototype.getDataForColumn = function (column, dataSet) {
  console.log("Cache " + column.field.type.getClass().getTableName());
  var self = this;
  var columnType = column.field.type;
  var where = {};
  if (columnType.getClass().rawAttributes.dataSetId) {
    if (dataSet === undefined) {
      return Promise.reject(new Error("dataSet must be defined"));
    }
    where["dataSetId"] = dataSet.id;
  }
  return columnType.getClass().findAll({
    where: where
  }).then(function (elements) {
    var data = {};
    self._cachedData[columnType.getClass().getTableName()] = data;
    var fieldName = column.name;
    if (column.field.typeField !== undefined) {
      fieldName = column.field.typeField;
    }
    for (var i = 0; i < elements.length; i++) {
      data[elements[i][fieldName]] = elements[i].id;
    }
    console.log("Cache " + column.field.type.getClass().getTableName() + " done");
  });
};
CsvParser.prototype.getDataForRow = function (column, key) {
  var value = this._cachedData[column.field.type.getClass().getTableName()][key];
  if (key !== undefined && value === undefined) {
    throw new Error("Cannot find element with id: " + key);
  }
  return value;
};

CsvParser.prototype.validate = function (data, modelObject) {
  console.log("validate " + modelObject.getClass().getTableName());
  return modelObject.getClass().findAll().then(function (dataInDb) {
    var dataInDbById = {};
    var i;
    for (i = 0; i < dataInDb.length; i++) {
      var entry = dataInDb[i];
      dataInDbById[entry.id] = entry;
    }
    for (i = data.length - 1; i >= 0; i--) {
      if (dataInDbById[data[i].id] !== undefined) {
        data.splice(i, 1);
      }
    }
  });
};

CsvParser.intToBoolean = function (variable) {
  return variable > 0;
};

CsvParser.stringToDate = function (variable) {
  return variable.substr(0, 4) + "-" + variable.substr(4, 2) + "-" + variable.substr(6, 2);
};


module.exports = CsvParser;