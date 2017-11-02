var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");


module.exports = AbstractObject.defineObject('stop', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  code: {
    type: Sequelize.STRING
  },
  latitude: {
    type: Sequelize.DOUBLE
  },
  longitude: {
    type: Sequelize.DOUBLE
  },
  zone: {
    type: Sequelize.STRING
  }
});