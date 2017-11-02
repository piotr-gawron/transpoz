var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");
var DataSet = require("./DataSet");
var Route = require("./Route");
var CalendarService = require("./CalendarService");


module.exports = AbstractObject.defineObject('trip', {
  trip_id: {
    type: Sequelize.STRING
  },
  headsign: {
    type: Sequelize.STRING
  },
  direction: {
    type: Sequelize.INTEGER
  },
  wheelchairAccess: {
    type: Sequelize.BOOLEAN
  }

}, function (modelObject) {
  modelObject.getClass().belongsTo(DataSet.getClass(), {as: "dataSet"});
  modelObject.getClass().belongsTo(Route.getClass(), {as: "route"});
  modelObject.getClass().belongsTo(CalendarService.getClass(), {as: "calendarService"});
});