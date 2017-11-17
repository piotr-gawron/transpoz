var Route = require("../models/Route");
var Stop = require("../models/Stop");
var StopTime = require("../models/StopTime");
var Trip = require("../models/Trip");


function TripUtils() {

}

TripUtils.prototype.init = function (params) {
  console.log("trip utils 1");
  var self = this;
  var dataSet = params.dataSet;
  self._dataSet = dataSet;
  self._stopTimesByTripId = [];
  self._stopTimesByStopId = [];
  self._tripsByTripId = [];
  self._routeByRouteId = [];
  var where = {"dataSetId": dataSet.id};
  return Stop.getClass().findAll().then(function (stops) {
    console.log("trip utils 2");
    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      self._stopTimesByStopId[stop.id] = [];
    }
    return Route.getClass().findAll({where: where});
  }).then(function (routes) {
    console.log("trip utils 3");
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      self._routeByRouteId[route.id] = route;
    }
    return Trip.getClass().findAll({where: where});
  }).then(function (trips) {
    console.log("trip utils 4");
    for (var i = 0; i < trips.length; i++) {
      var trip = trips[i];
      self._tripsByTripId[trip.id] = trip;
      self._stopTimesByTripId[trip.id] = [];
    }
    return StopTime.getClass().findAll({where: where})
  }).then(function (stopTimes) {
    console.log("trip utils 5");
    for (var i = 0; i < stopTimes.length; i++) {
      var stopTime = stopTimes[i];
      var tripStops = self._stopTimesByTripId[stopTime.tripId];
      tripStops[stopTime.stopSequence] = stopTime;
      var stopTimesByStopId = self._stopTimesByStopId[stopTime.stopId];
      stopTimesByStopId.push(stopTime);
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
    var stopTime = stopTimes[i];
    if (stopTime === undefined) {
      console.log("Problematic trip: " + params.tripId + ". Missing stop: " + i);
    } else {
      if (currentStopFound) {
        result.push(stopTime);
      } else if (stopTime.stopId === params.stop.id) {
        result.startStopTime = stopTime;
        currentStopFound = true;
      }
    }
  }
  return result;
};


TripUtils.prototype.getRouteByRouteId = function (routeId) {
  return this._routeByRouteId[routeId];
};


module.exports = TripUtils;