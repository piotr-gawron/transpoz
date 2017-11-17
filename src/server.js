var express = require('express');
var fs = require("fs-extra");
var Sequelize = require('sequelize');
require('console-stamp')(console);

var DbUtils = require('./dao/DbUtils');
var DataSet = require('./models/DataSet');
var BestTravelFrom = require("./algorithms/BestTravelFrom");
var PEKA = require("./travelSystems/PEKA");
var ZipDbParser = require('./parsers/ZipDbParser');


const sequelize = new Sequelize('sqlite://sqlite/db', {
  dialectOptions: {
    multipleStatements: true
  },
  logging: false
});
var filename;
// filename = "./testFiles/20170906_20170917.zip";
sequelize.authenticate().then(function () {
  DbUtils.setConnection(sequelize);
  return DbUtils.initDb();
}).then(function () {
  if (filename !== undefined) {
    return sequelize.sync({
      force: true
    }).then(function () {
      console.log("UPLOADING FILE: " + filename);
      return fs.readFile(filename);
    }).then(function (data) {
      return new ZipDbParser().parse(data);
    }).then(function (data) {
      console.log("Data processed");
    });
  } else {
    console.log("No processing");
  }
}).then(function () {
  var app = express();

  require('./routes')(app);
  app.listen(3001);
  console.log('Listening on port 3001...');
}).catch(function (e) {
  console.log(e);
});


