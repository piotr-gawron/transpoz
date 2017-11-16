var Promise = require("bluebird");

var Sequelize = require('sequelize');

var Agency = require('../src/models/Agency');
var CalendarService = require('../src/models/CalendarService');
var DbUtils = require('../src/dao/DbUtils');
var DataSet = require('../src/models/DataSet');
var Route = require('../src/models/Route');
var Stop = require('../src/models/Stop');
var Trip = require('../src/models/Trip');


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

function closeDbConnection() {
  return DbUtils.closeConnection();
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
    var promise = Promise.resolve();
    if (params.trip) {
      promise = Trip.create({"trip_id": "1_23733751^N+", "dataSetId": dataSet.id});
    }
    return promise;
  }).then(function () {
    var promise = Promise.resolve();
    if (params.stops) {
      promise = Stop.bulkCreate([{"id": 1715},
        {"id": 1712},
        {"id": 2992},
        {"id": 1708},
        {"id": 1709},
        {"id": 81},
        {"id": 79},
        {"id": 77},
        {"id": 76},
        {"id": 73},
        {"id": 4479},
        {"id": 102},
        {"id": 99},
        {"id": 94},
        {"id": 103},
        {"id": 105},
        {"id": 187},
        {"id": 183},
        {"id": 235},
        {"id": 237},
        {"id": 201},
        {"id": 204},
        {"id": 206},
        {"id": 208},
        {"id": 210},
        {"id": 3037},
        {"id": 3013},
        {"id": 217},
        {"id": 220},
        {"id": 1}], {raw: true});
    }
    return promise;
  }).then(function () {
    return dataSet;
  });
}

module.exports = {
  initDbConnection: initDbConnection,
  closeDbConnection: closeDbConnection,
  createDataSet: createDataSet
};