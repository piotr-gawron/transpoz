var JSZip = require("jszip");

var DataSet = require("../models/DataSet");

function ZipDbParser() {

}

ZipDbParser.prototype.parse = function (content, filename) {
  return JSZip.loadAsync(content).then(function (zip) {
    return DataSet.create();
  }).then(function (result) {
    if (filename) {
      var name = filename.replace(/^.*[\\\/]/, '');
      if (name.lastIndexOf(".") > 0) {
        name = name.substring(0, name.lastIndexOf('.'));
      }
      result.name = name;
    } else {
      result.name = "unknown";
    }
    return result;
  });
};

module.exports = ZipDbParser;