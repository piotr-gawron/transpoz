var Sequelize = require("sequelize");

var AbstractObject = require("./AbstractObject");

module.exports = AbstractObject.defineObject('data_set', {
  name: {
    type: Sequelize.STRING
  }
});
