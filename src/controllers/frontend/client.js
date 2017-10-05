function Client() {

}

Client.prototype.main = function (request, response) {
  response.send("Hello world");
};


module.exports = new Client();