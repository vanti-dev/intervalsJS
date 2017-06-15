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

  it('Tests replace', function() {
    let span2000 = new range.PeriodRange().fromDate("2000-01-01", "year");
    let span = span2000.replace({ upper: "2002-01-01" });

    let daterange2000 = new range.DateRange().fromDate("2000-01-01", "year");
    let daterange2001 = new range.DateRange().fromDate("2001-01-01", "year");

    let daterangeSpan = daterange2000.union(daterange2001);
    assert(span.isEqual(daterangeSpan));
  });

  it('Tests union', function() {
    let span2000 = new range.PeriodRange().fromDate('2000', 'year');
    let span2001 = new range.PeriodRange().fromDate('2001', 'year');

    let span = span2000.union(span2001);

    assert(span.lower.isSame('2000-01-01'));
    assert(span.upper.isSame('2002-01-01'));
    assert(span.constructor === range.DateRange);

    span2000 = new range.DateRange().fromDate('2000', 'year');
    span2001 = new range.PeriodRange().fromDate('2001', 'year');

    span = span2000.union(span2001);

    assert(span.lower.isSame('2000-01-01'));
    assert(span.upper.isSame('2002-01-01'));
    assert(span.constructor === range.DateRange);
  });

  it('Tests intersection', function() {
    let span2000 = new range.PeriodRange().fromDate('2000', 'week');
    let span2001 = new range.PeriodRange().fromDate('2000', 'month');

    let span = span2000.intersection(span2001);

    assert(span.lower.isSame('2000-01-01'));
    assert(span.upper.isSame('2000-01-03'));
    assert(span.constructor === range.DateRange);

    span2000 = new range.DateRange().fromDate('2000', 'week');
    span2001 = new range.PeriodRange().fromDate('2000', 'month');

    span = span2000.intersection(span2001);

    assert(span.lower.isSame('2000-01-01'));
    assert(span.upper.isSame('2000-01-03'));
    assert(span.constructor === range.DateRange);
  });

  it('Tests difference', function() {
    let span2000 = new range.PeriodRange().fromDate('2000', 'quarter');
    let span2001 = new range.PeriodRange().fromDate('2000', 'month');

    let span = span2000.difference(span2001);

    assert(span.lower.isSame('2000-02-01'));
    assert(span.upper.isSame('2000-04-01'));
    assert(span.constructor === range.DateRange);

    span2000 = new range.DateRange().fromDate('2000', 'quarter');
    span2001 = new range.PeriodRange().fromDate('2000', 'month');

    span = span2000.difference(span2001);

    assert(span.lower.isSame('2000-02-01'));
    assert(span.upper.isSame('2000-04-01'));
    assert(span.constructor === range.DateRange);
  });

  // it('Tests prev and next period', function() {
  //   let a = new range.PeriodRange().fromDate('2000', 'week');
  //   let b = new range.PeriodRange().fromDate('2001', 'week');
  //   // console.log(a);
  //   // console.log(a.offset(52));
  //   // console.log(b);
  //   assert(a.offset(52).isEqual(b));
  //   assert(a.isEqual(b.offset(-52)));
  // });
});
