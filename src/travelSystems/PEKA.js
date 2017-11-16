var Promise = require('bluebird');
var PriorityQueue = require('priorityqueuejs');

var Promise = require('bluebird');

var StopUtils = require('../utils/StopUtils');
var TripUtils = require('../utils/TripUtils');

function PEKA() {
}

PEKA.prototype.init = function (params) {
  var self = this;
  self._dataSet = params.dataSet;
  self._maxTransfers = 2;
  self._timeForTransfer = "00:02:00";
  self._timeForStopChange = "00:05:00";
  self._maxTimeForTransfer = "00:20:00";
  self._type = "MONEY";
  self._tripUtils = new TripUtils();
  self._stopUtils = new StopUtils();
  var promises = [];
  promises.push(self._tripUtils.init(params));
  promises.push(self._stopUtils.init());
  return Promise.all(promises);
};

PEKA.prototype.computeNextStates = function (params, calendarServiceIds) {
  var self = this;
  var type = self._type;

  var stop = params.stop;
  var maxTime = self.addTime(params.time, self._maxTimeForTransfer);
  var minTime = self.addTime(params.time, self._timeForTransfer);
  var transfers = params.transfers;
  if (transfers === undefined) {
    transfers = 0;
  }

  var value;

  if (type === "TIME") {
    value += self.timeToMinutes(self._timeForTransfer);
  } else if (type === "MONEY") {
    value = params.value;
  } else {
    throw new Error("Invalid type: " + type + ". Expected 'TIME' or 'MONEY'");
  }

  var result = [];
  result = result.concat(self.computeNextStatesForStop({
    maxTime: maxTime,
    minTime: minTime,
    stop: stop,
    type: type,
    value: value,
    transfers: transfers,
    calendarServiceIds: calendarServiceIds
  }));

  minTime = self.addTime(minTime, self._timeForStopChange);

  var stops = self._stopUtils.getStopsForCode(stop.code);
  for (var i = 0; i < stops.length; i++) {
    if (stop.code !== stops[i].code) {
      result = result.concat(self.computeNextStatesForStop({
        maxTime: maxTime,
        minTime: minTime,
        stop: stops[i],
        type: type,
        value: value,
        transfers: transfers,
        calendarServiceIds: calendarServiceIds
      }));
    }
  }
  return result;
};

PEKA.prototype.computeNextStatesForStop = function (params) {
  var self = this;
  var type = params.type;
  if (params.transfers > self._maxTransfers) {
    return [];
  }
  var result = [];

  var tripUtils = self._tripUtils;
  var trips = tripUtils.getTripsByStopTimes(params);

  for (var i = 0; i < trips.length; i++) {
    var trip = trips[i];
    var stopTimes = tripUtils.getNextStopsForTripId({tripId: trip.id, stop: params.stop});
    for (var j = 0; j < stopTimes.length; j++) {
      var stopTime = stopTimes[j];
      var value = params.value;
      if (type === "TIME") {
        value += self.timeToMinutes(self.subTime(stopTime.arrivalTime, params.minTime));
      } else if (type === "MONEY") {
        value += j + 1;
      } else {
        throw new Error("Invalid type: " + type + ". Expected 'TIME' or 'MONEY'");
      }

      var state = {
        time: stopTime.arrivalTime,
        value: value,
        stop: self._stopUtils.getStopById(stopTime.stopId),
        transfers: params.transfers + 1
      };
      result.push(state);
    }
  }
  return result;
};

PEKA.prototype.isWorthUsing = function (state, otherStates) {
  var result = true;
  for (var i = 0; i < otherStates.length; i++) {
    var otherState = otherStates[i];
    if (otherState.value <= state.value && otherState.transfers <= state.transfers) {
      result = false;
    }
  }
  return result;
};

PEKA.prototype.addTime = function (a, b) {
  var self = this;
  var t1 = a.split(":");
  var t2 = b.split(":");
  var t3 = [0, 0, 0];
  for (var i = 2; i >= 0; i--) {
    t3[i] += parseInt(t2[i]) + parseInt(t1[i]);
    if (i > 0 && t3[i] >= 60) {
      t3[i] -= 60;
      t3[i - 1] += 1;
    }
  }
  return self.padInt(t3[0], 2) + ":" + self.padInt(t3[1], 2) + ":" + self.padInt(t3[2], 2);
};

PEKA.prototype.padInt = function (num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};


module.exports = PEKA;