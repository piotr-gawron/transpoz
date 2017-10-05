var express = require('express');
var Sequelize = require('sequelize');
var DbUtils = require('./dao/DbUtils');

const sequelize = new Sequelize('sqlite://sqlite/db', {
  dialectOptions: {
    multipleStatements: true
  }
});
sequelize.authenticate().then(function () {
  DbUtils.setConnection(sequelize);
  DbUtils.initDb();
});


var app = express();

require('./routes')(app);
app.listen(3001);
console.log('Listening on port 3001...');
