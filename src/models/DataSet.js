var Sequelize = require("sequelize");

var DbObject;

function setConnection(connection) {
  DbObject = connection.define('data_set', {
    name: {
      type: Sequelize.STRING
    }
  });
  console.log(DbObject);
}

function create() {
  console.log(DbObject);
  return DbObject.create();
}

module.exports = {
  setConnection: setConnection,
  create: create
};