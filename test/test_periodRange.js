const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('periodRange', function() {

  it('Tests period type', function() {
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

  it('Tests period empty error', function() {
    let periodRange = new range.PeriodRange();

    expect(() => periodRange.empty()).to.throw(Error);
  });

  it('Tests daterange property', function() {
    let periodRange = new range.PeriodRange().fromDate("2000-01-01", "month");
    let dateRangeSpan = new range.DateRange().fromDate("2000-01-01", "month");

    assert(periodRange.daterange instanceof range.DateRange);
    assert(dateRangeSpan.isEqual(periodRange.daterange));
  });

  // it('Tests replace', function() {
  //   let span2000 = new range.PeriodRange().fromDate("2000-01-01", "year");
  //   let span = span2000.replace({ upper: "2002-01-01" });
  //
  //   let daterange2000 = new range.DateRange().fromDate("2000-01-01", "year");
  //   let daterange2001 = new range.DateRange().fromDate("2001-01-01", "year");
  //
  //   let daterangeSpan = daterange2000.union(daterange2001);
  //
  //   assert(span.isEqual(daterangeSpan));
  // });
});
