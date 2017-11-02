var Agency = require("../models/Agency");
var DataSet = require("../models/DataSet");

function DbUtils() {

}

DbUtils.prototype.setConnection = function (connection) {
  this._connection = connection;
};

DbUtils.prototype.getConnection = function () {
  return this._connection;
};

DbUtils.prototype.initDb = function () {
  var db = this.getConnection();
  DataSet.setConnection(db);
  Agency.setConnection(db);
};

module.exports = new DbUtils();