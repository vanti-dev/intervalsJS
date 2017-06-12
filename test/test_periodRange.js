const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('periodRange', function() {
  it ('Tests period type', function() {
    let periodRange = new range.PeriodRange().fromDate('2000-01-01', 'day');
    assert(periodRange.period == 'day');

    periodRange = periodRange.fromDate('2000-01-01', 'week');
    assert(periodRange.period == 'week');

    periodRange = periodRange.fromDate('2000-01-01', 'americanWeek');
    assert(periodRange.period == 'americanWeek');

    periodRange = periodRange.fromDate('2000-01-01', 'month');
    assert(periodRange.period == 'month');

    periodRange = periodRange.fromDate('2000-01-01', 'quarter');
    assert(periodRange.period == 'quarter');

    periodRange = periodRange.fromDate('2000-01-01', 'year');
    assert(periodRange.period == 'year');
  });
});
