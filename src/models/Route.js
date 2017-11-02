var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");
var Agency = require("./Agency");
var DataSet = require("./DataSet");


module.exports = AbstractObject.defineObject('route', {
    route_id: {
      type: Sequelize.INTEGER
    },
    shortName: {
      type: Sequelize.STRING
    },
    longName: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.INTEGER
    },
    color: {
      type: Sequelize.STRING
    },
    textColor: {
      type: Sequelize.STRING
    }
  }, function (modelObject) {
    modelObject.getClass().belongsTo(Agency.getClass(), {as: "agency"});
    modelObject.getClass().belongsTo(DataSet.getClass(), {as: "dataSet"});
  }
);