var client = require('./controllers/frontend/client');

module.exports = function (app) {
  app.get('/', client.main);
};