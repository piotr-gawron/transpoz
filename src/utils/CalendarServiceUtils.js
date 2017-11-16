var CalendarService = require("../models/CalendarService");


function CalendarServiceUtils() {

}

CalendarServiceUtils.prototype.init = function (params) {
  var self = this;
  var dataSet = params.dataSet;
  var where = {"dataSetId": dataSet.id};

  return CalendarService.getClass().findAll({where: where}).then(function (calendarServices) {
    self._calendarServices = calendarServices;
  });
};

CalendarServiceUtils.prototype.getIdsByDate = function (date) {
  var self = this;
  var day = new Date(date).getDay();
  var result = [];
  for (var i = 0; i < self._calendarServices.length; i++) {
    var service = self._calendarServices[i];
    if (date >= service.startDate && date <= service.endDate) {
      if (day === 0 && service.sunday) {
        result.push(service);
      } else if (day === 1 && service.monday) {
        result.push(service);
      } else if (day === 2 && service.tuesday) {
        result.push(service);
      } else if (day === 3 && service.wednesday) {
        result.push(service);
      } else if (day === 4 && service.thursday) {
        result.push(service);
      } else if (day === 5 && service.friday) {
        result.push(service);
      } else if (day === 6 && service.saturday) {
        result.push(service);
      }
    }
  }
  return result;
};


module.exports = CalendarServiceUtils;