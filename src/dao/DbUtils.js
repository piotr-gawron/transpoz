var Agency = require("../models/Agency");
var DataSet = require("../models/DataSet");
var Route = require("../models/Route");
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
  return DataSet.setConnection(db).then(function(){
    return Agency.setConnection(db);
  }).then(function(){
    return Stop.setConnection(db);
  }).then(function(){
    return Route.setConnection(db);
  });
};

module.exports = new DbUtils();