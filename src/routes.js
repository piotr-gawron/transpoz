var client = require('./controllers/frontend/client');
var api = require('./controllers/api/main');

module.exports = function (app) {
  app.get('/', client.main);
  app.use('/api', api);
};