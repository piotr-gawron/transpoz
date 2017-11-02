var Agency = require("../models/Agency");
var DataSet = require("../models/DataSet");
var Stop = require("../models/Stop");

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
  Agency.setConnection(db);
  DataSet.setConnection(db);
  Stop.setConnection(db);
};

module.exports = new DbUtils();