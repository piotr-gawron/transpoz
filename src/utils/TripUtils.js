var Stop = require("../models/Stop");
var StopTime = require("../models/StopTime");
var Trip = require("../models/Trip");


function TripUtils() {

}

TripUtils.prototype.init = function (params) {
  var self = this;
  var dataSet = params.dataSet;
  self._dataSet = dataSet;
  self._stopTimesByTripId = [];
  self._stopTimesByStopId = [];
  self._tripsByTripId = [];
  var where = {"dataSetId": dataSet.id};
  return Stop.getClass().findAll().then(function (stops) {
    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      self._stopTimesByStopId[stop.id] = [];
    }
    return StopTime.getClass().findAll({where: where})
  }).then(function (stopTimes) {
    for (var i = 0; i < stopTimes.length; i++) {
      var stopTime = stopTimes[i];
      var tripStops = self._stopTimesByTripId[stopTime.tripId];
      if (tripStops === undefined) {
        self._stopTimesByTripId[stopTime.tripId] = [];
        tripStops = self._stopTimesByTripId[stopTime.tripId];
      }
      tripStops[stopTime.stopSequence] = stopTime;

      var stopTimesByStopId = self._stopTimesByStopId[stopTime.stopId];
      stopTimesByStopId.push(stopTime);
    }
    return Trip.getClass().findAll({where: where});
  }).then(function (trips) {
    for (var i = 0; i < trips.length; i++) {
      var trip = trips[i];
      self._tripsByTripId[trip.id] = trip;
    }
  });
};

TripUtils.prototype.getTripsByStopTimes = function (params) {
  var self = this;
  var i;
  var stopTimes = self._stopTimesByStopId[params.stop.id];
  var result = [];
  var calendarServices = {};
  for (i = 0; i < params.calendarServiceIds.length; i++) {
    calendarServices[params.calendarServiceIds[i].id] = true;
  }
  for (i = 0; i < stopTimes.length; i++) {
    var stopTime = stopTimes[i];
    var trip = self._tripsByTripId[stopTime.tripId];
    if (stopTime.departureTime >= params.minTime && stopTime.departureTime <= params.maxTime && calendarServices[trip.calendarServiceId]) {
      result.push(trip);
    }
  }
  return result;
};

TripUtils.prototype.getNextStopsForTripId = function (params) {
  var self = this;
  var stopTimes = self._stopTimesByTripId[params.tripId];
  var result = [];
  var currentStopFound = false;
  for (var i = 0; i < stopTimes.length; i++) {
    if (currentStopFound) {
      result.push(stopTimes[i]);
    } else if (stopTimes[i].stopId === params.stop.id) {
      currentStopFound = true;
    }
  }
  return result;
};


module.exports = TripUtils;