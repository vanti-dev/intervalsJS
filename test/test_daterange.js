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
    expect(() => new range.DateRange({lower: "2000-01-01", lowerInc: "2001-01-01"})).to.throw(Error);
    expect(() => new range.DateRange({lower: "2000-01-01", upperInc: "2001-01-01"})).to.throw(Error);
    expect(() => new range.DateRange({lower: "2000-01-01", upper: "1999-01-01"})).to.throw(Error);
  });

  it('Tests replace', function () {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-02"});
    DateRange.replace({lower:"2000-01-03", upper:"2000-01-10"});
    assert(DateRange.isEqual(new range.DateRange({lower:"2000-01-03", upper:"2000-01-10"})));
    assert(DateRange.lowerInc);

    DateRange.replace({lowerInc:true, upperInc:true});
    assert(DateRange.upperInc);
    assert(DateRange.lowerInc);
  });

  it('Tests start after', function() {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper: "2000-01-05"});
    let startsAfter = new range.DateRange({lower:"1999-01-01"});
    let unbounded = new range.DateRange().empty();

    assert(DateRange.startsAfter(startsAfter));
    assert(DateRange.startsAfter("1990-03-04"));
    assert(!DateRange.startsAfter("2001-01-01"));
    assert(DateRange.startsAfter(unbounded));
  });

  it('Tests ends before', function() {
    let DateRange = new range.DateRange({lower: "2000-01-01", upper:"2000-01-03"});
    let endsBefore = new range.DateRange({lower: "2000-01-01", upper: "2000-01-08"});
    let noUB = new range.DateRange({lower: "2000-01-01"});
    let unbounded = new range.DateRange().empty();

    assert(DateRange.endsBefore(endsBefore));
    assert(DateRange.endsBefore("2001-01-01"));
    assert(!DateRange.endsBefore("2000-01-01"));
    assert(!noUB.endsBefore(endsBefore));
    assert(DateRange.endsBefore(unbounded));
  });

  it('Tests starts with', function() {
    let DateRange =  new range.DateRange({lower: "2000-01-01", upper:"2000-01-10", lowerInc: true});
    let startsWith = new range.DateRange({lower:"2000-01-01", upper:"2000-01-05", lowerInc: true});

    assert(DateRange.startsWith(startsWith));
    assert(DateRange.startsWith("2000-01-01"));
    startsWith.replace({lowerInc: false});

    assert(!DateRange.startsWith(startsWith));
  });

  it('Tests ends with', function() {
    let DateRange =  new range.DateRange({lower: "2000-01-01", upper:"2000-01-10", upperInc: true});
    let endsWith = new range.DateRange({upper:"2000-01-10", lower:"2000-01-05", upperInc: true});

    assert(DateRange.endsWith(endsWith));
    assert(DateRange.endsWith("2000-01-10"));
    assert(!DateRange.endsWith("1999-10-10"));

    endsWith.replace({upperInc: false});
    assert(!DateRange.endsWith(endsWith));
  });

  it('tests contains', function () {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-10"});
    let contain = new range.DateRange({lower: "2000-01-01", upper: "2000-01-10"});

    assert(DateRange.contains(contain));

    contain.replace({lower:"2000-01-03", upper:"2000-01-12"});
    assert(!DateRange.contains(contain));

    contain.replace({lower:"1999-12-31", upper:"2000-01-09"});
    assert(!DateRange.contains(contain));

    let unbounded = new range.DateRange().empty();
    assert(DateRange.contains("2000-01-05"));
    assert(!DateRange.contains("2001-01-01"));
    assert(!DateRange.contains(unbounded));
  });

  it('tests overlaps', function() {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-10", upperInc: true});
    let overlaps = new range.DateRange({lower: "2000-01-10", upper: "2000-01-17", lowerInc: true});

    assert(DateRange.overlap(overlaps));

    overlaps.replace({lower:"1999-01-01", upper:"2000-01-05"});
    assert(DateRange.overlap(overlaps));

    overlaps.replace({lower:"2000-10-18", upper:"2001-01-01"});
    assert(!DateRange.overlap(overlaps));

    let DateRangeUnbounded = new range.DateRange().empty();
    assert(DateRange.overlap(DateRangeUnbounded));

    assert(!DateRange.overlap());
  });

  it('tests adjacent', function() {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-10"});
    let adjacent = new range.DateRange({lower: "2000-01-10", upper: "2000-01-17", lowerInc: true});

    assert(DateRange.adjacent(adjacent));
    adjacent.replace({lower: "2001-01-01", upper: "2000-02-27"});
    assert(!DateRange.adjacent(adjacent));

  });

  it('tests union', function() {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-10"});
    let DateRange2 = new range.DateRange({lower: "2000-01-02", upper: "2000-01-12"});


    assert(DateRange.union(DateRange2).upper.isSame("2000-01-12"));
    assert(DateRange.union(DateRange2).lower.isSame("2000-01-01"));

    DateRange2.replace({upper: "2000-01-10"});
    assert(DateRange.union(DateRange2).upper.isSame("2000-01-10"));
    assert(DateRange.union(DateRange2).lower.isSame("2000-01-01"));
  });

  it('tests difference', function() {
    let DateRange = new range.DateRange({lower:"2000-01-01", upper:"2000-01-10", upperInc: true, lowerInc: true});
    let DateRange2 = new range.DateRange({lower: "2000-01-08", upper: "2000-01-15", lowerInc: true});
    DateRange.difference(DateRange2);

    assert(DateRange.lower.isSame("2000-01-01"));
    assert(DateRange.upper.isSame("2000-01-08"));

    DateRange.replace({upper: "2000-01-05"});
    DateRange2.replace({lower: "2000-01-01"});
    assert(DateRange.difference(DateRange2).isEmpty);

    let noOverlap = new range.DateRange({lower: "2100-01-01", upper: "2200-01-01"});
    expect(() => DateRange.difference(noOverlap)).to.throw(Error);
  });

  it('tests intersection', function() {
    let DateRange = new range.DateRange({lower: "2000-01-03", upper: "2000-01-05", lowerInc: true, upperInc: false});
    let DateRange2 = new range.DateRange({lower: "2000-01-01", upper: "2000-01-10"});
    DateRange.intersection(DateRange2);

    assert(DateRange.lower.isSame("2000-01-03"));
    assert(DateRange.upper.isSame("2000-01-05"));

    DateRange2.replace({lower: "2001-01-01", upper: "2001-01-05"});
    assert(DateRange.intersection(DateRange2).isEmpty);

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

  it('Tests iteration', function() {
    let DateRange = new range.DateRange({lower: '2000-01-01', upper: '2000-01-28'});
    let current = DateRange.lower;
    for (let x of DateRange) {
        assert(current === x);
        current = DateRange.next(current);
    }
  });
});
