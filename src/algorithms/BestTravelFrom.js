var PriorityQueue = require('priorityqueuejs');

var Promise = require('bluebird');

var StopUtils = require('../utils/StopUtils');
var CalendarServiceUtils = require('../utils/CalendarServiceUtils');

function BestTravelFrom(params) {
  this._dataSet = params.dataSet;
  this._travelSystem = params.travelSystem;
}

BestTravelFrom.prototype.init = function () {
  var self = this;
  var dataSet = self._dataSet;
  self._stopUtils = new StopUtils(dataSet);
  self._calendarServiceUtils = new CalendarServiceUtils();

  var promises = [];
  promises.push(self._stopUtils.init());
  promises.push(self._calendarServiceUtils.init({dataSet: dataSet}));
  promises.push(self._travelSystem.init({dataSet: dataSet}));
  return Promise.all(promises);
};

BestTravelFrom.prototype.getBestFrom = function (params) {
  var self = this;
  var i;

  var time = params.time;
  var date = params.date;
  var stopCode = params.stopCode;
  var travelSystem = self._travelSystem;
  var calendarServiceIds = self._calendarServiceUtils.getIdsByDate(date);


  var stopUtils = self._stopUtils;

  var statesByStop = {};
  var stops = stopUtils.getAllStops();
  for (i = 0; i < stops.length; i++) {
    statesByStop[stops[i].id] = [];
  }


  var queue = new PriorityQueue(function (a, b) {
    return a.value - b.value;
  });
  stops = stopUtils.getStopsForCode(stopCode);
  if (stops === undefined) {
    throw new Error("Invalid stop code: " + stopCode);
  }
  for (i = 0; i < stops.length; i++) {
    var stop = stops[i];
    var state = {
      time: time,
      value: 0,
      stop: stop
    };
    queue.enq(state);
    statesByStop[stop.id].push(state);
  }

  while (!queue.isEmpty()) {
    state = queue.deq();
    var states = travelSystem.computeNextStates(state, calendarServiceIds);
    for (i = 0; i < states.length; i++) {
      state = states[i];
      if (travelSystem.isWorthUsing(state, statesByStop[state.stop.id])) {
        queue.enq(state);
        statesByStop[state.stop.id].push(state);
      }
    }
  }
  var result = [];
  if (params.fullStopList) {
    stops = stopUtils.getAllStops();
    for (i = 0; i < stops.length; i++) {
      stop = stops[i];
      result.push(self.getBestState(statesByStop[stop.id]));
    }
  } else {
    var stopPrefixes = stopUtils.getStopPrefixes();
    for (i = 0; i < stopPrefixes.length; i++) {
      states = [];
      stops = stopUtils.getStopsForCode(stopPrefixes[i]);
      for (j = 0; j < stops.length; j++) {
        states = states.concat(statesByStop[stops[j].id]);
      }
      result.push(self.getBestState(states));
    }
  }
  return result;
};

BestTravelFrom.prototype.getBestState = function (states) {
  if (states.length === 0) {
    return null;
  }
  var result = states[0];
  for (var i = 0; i < states.length; i++) {
    if (states[i].value < result.value) {
      result = states[i];
    }
  }
  return result;

};


module.exports = BestTravelFrom;