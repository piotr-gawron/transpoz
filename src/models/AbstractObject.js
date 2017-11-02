function defineObject(name, definition) {
  var DbObject;

  function setConnection(connection) {
    DbObject = connection.define(name, definition);
  }

  function create(params) {
    return DbObject.create(params);
  }

  function getClass() {
    return DbObject;
  }

  return {
    setConnection: setConnection,
    create: create,
    getClass: getClass
  }
}


module.exports = {
  defineObject: defineObject
};