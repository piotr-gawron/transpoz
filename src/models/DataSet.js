var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");

module.exports = AbstractObject.defineObject('data_set', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, name: {
    type: Sequelize.STRING
  }
});
