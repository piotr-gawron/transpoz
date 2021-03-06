var Promise = require("bluebird");

function defineObject(name, definition, onConnectionSet) {
  var DbObject;
  var result;

  function setConnection(connection) {
    DbObject = connection.define(name, definition);
    if (onConnectionSet !== undefined) {
      return onConnectionSet(result);
    } else {
      return Promise.resolve();
    }
  }

  function create(params) {
    return DbObject.create(params);
  }

  function bulkCreate(params) {
    return DbObject.bulkCreate(params);
  }

  function getClass() {
    return DbObject;
  }

  result = {
    setConnection: setConnection,
    create: create,
    bulkCreate: bulkCreate,
    getClass: getClass
  };
  return result;
}


module.exports = {
  defineObject: defineObject
};