var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");
var DataSet = require("./DataSet");


module.exports = AbstractObject.defineObject('calendar_service', {
  service_id: {
    type: Sequelize.INTEGER
  },
  monday: {
    type: Sequelize.BOOLEAN
  },
  tuesday: {
    type: Sequelize.BOOLEAN
  },
  wednesday: {
    type: Sequelize.BOOLEAN
  },
  thursday: {
    type: Sequelize.BOOLEAN
  },
  friday: {
    type: Sequelize.BOOLEAN
  },
  saturday: {
    type: Sequelize.BOOLEAN
  },
  sunday: {
    type: Sequelize.BOOLEAN
  },
  startDate: {
    type: Sequelize.DATEONLY
  },
  endDate: {
    type: Sequelize.DATEONLY
  }

}, function (modelObject) {
  return modelObject.getClass().belongsTo(DataSet.getClass(), {as: "dataSet"});
});