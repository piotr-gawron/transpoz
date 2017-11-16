var Stop = require("../models/Stop");


function StopUtils() {

}

function getStopPrefix(stopCode) {
  return stopCode.replace(/[0-9]/g, '');
}

StopUtils.prototype.init = function () {
  var self = this;
  self._stopByPrefix = {};
  self._stopById = {};
  return Stop.getClass().findAll().then(function (stops) {
    self._stops = stops;
    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var prefix = getStopPrefix(stop.code);
      var stopsForPrefix = self._stopByPrefix[prefix];
      if (stopsForPrefix === undefined) {
        self._stopByPrefix[prefix] = [];
        stopsForPrefix = self._stopByPrefix[prefix];
      } else {
        if (stop.name !== stopsForPrefix[0].name) {
          return Promise.reject(new Error("Two different names for prefix " + prefix + ". " + stop.name + ", " + stopsForPrefix[0].name))
        }
      }
      stopsForPrefix.push(stop);
      self._stopById[stop.id] = stop;
    }
  });
};

StopUtils.prototype.getStopsForCode = function (stopCode) {
  return this._stopByPrefix[getStopPrefix(stopCode)];
};

StopUtils.prototype.getStopPrefixes = function () {
  var result = [];
  for (var key in this._stopByPrefix) {
    if (this._stopByPrefix.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
};

StopUtils.prototype.getStopById = function (id) {
  return this._stopById[id];
};

StopUtils.prototype.getUnifiedStops = function () {
  var result = [];
  var stopByPrefix = this._stopByPrefix;
  for (var key in stopByPrefix) {
    if (stopByPrefix.hasOwnProperty(key)) {
      result.push({key: key, name: stopByPrefix[key][0].name});
    }
  }
  return result;
};

StopUtils.prototype.getAllStops = function () {
  return this._stops;
};


module.exports = StopUtils;