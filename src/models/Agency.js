var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");


module.exports = AbstractObject.defineObject('agency', {
  agency_id: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  language: {
    type: Sequelize.STRING
  }
});