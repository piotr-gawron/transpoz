var Sequelize = require('sequelize');
var DbUtils = require('../src/dao/DbUtils');


function initDbConnection() {
  const sequelize = new Sequelize('sqlite://sqlite/db_test', {
    dialectOptions: {
      multipleStatements: true
    },
    logging: false
  });
  return sequelize.authenticate().then(function () {
    DbUtils.setConnection(sequelize);
    DbUtils.initDb();
    return sequelize.sync({
      force: true
    });
  });
}

module.exports = {
  initDbConnection: initDbConnection
};