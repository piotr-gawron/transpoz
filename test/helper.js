var Promise = require("bluebird");

var Sequelize = require('sequelize');

var Agency = require('../src/models/Agency');
var CalendarService = require('../src/models/CalendarService');
var DbUtils = require('../src/dao/DbUtils');
var DataSet = require('../src/models/DataSet');
var Route = require('../src/models/Route');


function initDbConnection() {
  const sequelize = new Sequelize('sqlite://sqlite/db_test', {
    dialectOptions: {
      multipleStatements: true
    },
    logging: false
  });
  return sequelize.authenticate().then(function () {
    DbUtils.setConnection(sequelize);
    return DbUtils.initDb();
  }).then(function () {
    return sequelize.sync({
      force: true
    });
  });
}

function createDataSet(params) {
  if (params === undefined) {
    params = {};
  }
  var dataSet;
  return DataSet.create().then(function (result) {
    dataSet = result;
    var promise = Promise.resolve();
    if (params.agency) {
      promise = Agency.create({"agency_id": 8, "dataSetId": dataSet.id});
    }
    return promise;
  }).then(function () {
    var promise = Promise.resolve();
    if (params.calendarService) {
      promise = CalendarService.create({"service_id": 1, "dataSetId": dataSet.id});
    }
    return promise;
  }).then(function () {
    var promise = Promise.resolve();
    if (params.route) {
      promise = Route.create({"route_id": 1, "dataSetId": dataSet.id});
    }
    return promise;
  }).then(function () {
    return dataSet;
  });
}

module.exports = {
  initDbConnection: initDbConnection,
  createDataSet: createDataSet
};