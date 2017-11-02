var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");
var DataSet = require("./DataSet");
var Stop = require("./Stop");
var Trip = require("./Trip");


module.exports = AbstractObject.defineObject('stop_time', {
  arrivalTime: {
    type: Sequelize.STRING
  },
  departureTime: {
    type: Sequelize.STRING
  },
  headsign: {
    type: Sequelize.STRING
  },
  stopSequence: {
    type: Sequelize.STRING
  },
  pickupType: {
    type: Sequelize.INTEGER
  },
  dropOffType: {
    type: Sequelize.INTEGER
  }

}, function (modelObject) {
  modelObject.getClass().belongsTo(DataSet.getClass(), {as: "dataSet"});
  modelObject.getClass().belongsTo(Trip.getClass(), {as: "trip"});
  modelObject.getClass().belongsTo(Stop.getClass(), {as: "stop"});
});