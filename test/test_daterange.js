const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('DateRange', function() {
  it('Tests creation, typecheck and equality', function() {
    let DateRange = new range.DateRange({lower:'2017-06-11', upper:'2017-06-15'});
    let equalDateRange = new range.DateRange({lower:'2017-06-11', upper:'2017-06-15'});

    assert(DateRange);
    assert(DateRange.isEqual(equalDateRange));

    expect(() => new range.DateRange({lower: 1})).to.throw(Error);
    expect(() => new range.DateRange({upper: 5})).to.throw(Error);
  });

  it('Tests offset', function() {
    let rangeLow = new range.DateRange({lower: '2000-01-01', upper:'2000-01-06'});
    let rangeHigh = new range.DateRange({lower: '2000-01-05', upper:'2000-01-10'});

    assert(!rangeLow.isEqual(rangeHigh));
    assert(rangeLow.offset(moment.duration(4, 'days')).isEqual(rangeHigh));
  });

  it('Tests from date (day)', function() {
    let DateRange = new range.DateRange().fromDate('2000-01-01');
    let secondDateRange = new range.DateRange({lower: '2000-01-01', upper: '2000-01-02'});
    console.log(DateRange);
    console.log(secondDateRange);
    assert(DateRange.isEqual(secondDateRange));
  });

  it('Tests from date (week)', function() {
    let date = '2000-01-01';
    let DateRange = new range.DateRange().fromDate('2000-01-01', 'week');
    let DateRangeComp = new range.DateRange({lower: '1999-12-27', upper:'2000-01-03'});

    assert(DateRange.isEqual(DateRangeComp));

    expect(() => DateRange.fromDate('2000-01-01', 'zeeblezorp')).to.throw(Error);

    DateRange = DateRange.fromDate('2000-01-02', 'week');
    assert(DateRange.isEqual(DateRangeComp));

    DateRange = DateRange.fromDate('2000-01-03', 'week');
    DateRangeComp.replace({lower: '2000-01-02', upper: '2000-01-09'});

    assert(DateRange.isEqual(DateRangeComp));
  });

  it('Tests from date (American week)', function() {
    let DateRange = new range.DateRange().fromDate('2000-01-01', 'americanWeek');
    let DateRangeComp = new range.DateRange({lower: '1999-12-26', upper:'2000-01-02'});

    assert(DateRange.isEqual(DateRangeComp));

    DateRange = DateRange.fromDate('2000-01-02', 'americanWeek');
    DateRangeComp.replace({lower: '2000-01-02', upper: '2000-01-09'});
    assert(DateRange.isEqual(DateRangeComp));

    DateRange = DateRange.fromDate('2000-01-03', 'americanWeek');

    assert(DateRange.isEqual(DateRangeComp));
  });

  it('Tests from date (month)', function() {
    let DateRange = new range.DateRange().fromDate('2000-01-01', 'month');
    let DateRangeComp = new range.DateRange({lower: '2000-01-01', upper:'2000-01-31', upperInc: true});

    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2000-02-15', 'month');
    DateRangeComp = new range.DateRange({lower: '2000-02-1', upper: '2000-02-29', upperInc: true});

    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2001-02-15', 'month');
    DateRangeComp = new range.DateRange({lower: '2001-02-1', upper: '2001-02-28', upperInc: true});

    assert(DateRange.isEqual(DateRangeComp));

  });

  it('Tests from date (quarter)', function() {
    let DateRange = new range.DateRange().fromDate('2000-01-01', 'quarter');
    let DateRangeComp = new range.DateRange({lower: '2000-01-01', upper:'2000-03-31', upperInc: true});

    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2000-02-15', 'quarter');
    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2000-03-31', 'quarter');
    assert(DateRange.isEqual(DateRangeComp));
  });

  it('Tests from date (year)', function() {
    let DateRange = new range.DateRange().fromDate('2000-01-01', 'year');
    let DateRangeComp = new range.DateRange({lower: '2000-01-01', upper:'2001-01-01'});

    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2000-06-12', 'year');
    assert(DateRange.isEqual(DateRangeComp));

    DateRange = new range.DateRange().fromDate('2000-12-31', 'year');
    assert(DateRange.isEqual(DateRangeComp));
  });

  it('Tests period type check', function () {
    expect(() => new range.DateRange().fromDate('2000-01-01', 'YEAR').to.throw(Error));
    expect(() => new range.DateRange().fromDate('2000-01-01', 'Year').to.throw(Error));
    expect(() => new range.DateRange().fromDate('2000-01-01', 'foobar').to.throw(Error));
  });

  it('Tests date type check', function () {
    expect(() => new range.DateRange().fromDate(true, 'year').to.throw(Error));
    expect(() => new range.DateRange().fromDate('foobar', 'year').to.throw(Error));
    expect(() => new range.DateRange().fromDate(1, 'year').to.throw(Error));
  });

  it('Tests length', function() {
    let DateRange = new range.DateRange({lower: '2000-01-01', upper:'2000-02-01'});
    assert(DateRange.length() === 31);

    expect(() => new range.DateRange({lower: '2000-3-18'}).length().to.throw(Error));
  });

  // it('Tests iteration', function() {
  //   let DateRange = new range.DateRange({lower: '2000-01-01', upper: '2000-01-28'});
  //   let current = DateRange.lower;
  //   for (let x of DateRange) {
  //       assert(current === x);
  //       current = DateRange.next(current);
  //   }
  // });
});
