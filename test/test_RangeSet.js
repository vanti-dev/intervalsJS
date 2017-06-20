const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('IntRangeSet', function() {
  it('Tests Empty & not empty', function() {
    assert(new range.IntRangeSet([]).isEmpty);
    assert(!(new range.IntRangeSet([new range.IntRange({ lower: 1})]).isEmpty));
  });

  it('Tests Span', function() {
    const range1 = new range.IntRange({ lower: 1, upper: 5});
    const range2 = new range.IntRange({ lower: 10, upper: 15});
    const rangeset = new range.IntRangeSet([range1, range2]);
    const span = new range.IntRange({lower: 1, upper: 15});
    assert(rangeset.span().isEqual(span));
    assert(new range.IntRangeSet([]).span().isEqual(new range.IntRange().empty()));
  });

  it('Tests Iteration', function() {
    const range1 = new range.IntRange({ lower: 1, upper: 5});
    const range2 = new range.IntRange({ lower: 10, upper: 15});
    const rangeset = new range.IntRangeSet([range1, range2]);
    let i = 0;
    for (let range of rangeset) {
      if (i === 0) {
        assert(range.isEqual(range1));
      }
      else {
        assert(range.isEqual(range2));
      }
      i += 1;
    }
  });

  it('Test copy', function() {
    const range1 = new range.IntRange({ lower: 1, upper: 5});
    const range2 = new range.IntRange({ lower: 10, upper: 15});
    const rangeset = new range.IntRangeSet([range1, range2]);
    const copy = rangeset.copy();
    
    assert(rangeset.isEqual(copy));
  });

  it('Tests contains', function() {
    const rangeset = new range.IntRangeSet([new range.IntRange({lower: 1, upper: 10})]);
    assert(rangeset.contains(new range.IntRange({lower: 1, upper: 5})));
    assert(rangeset.contains(new range.IntRange({lower: 5, upper: 10})));
    assert(rangeset.contains(new range.IntRange().empty()));
    assert(rangeset.contains(1));
    assert(rangeset.contains(5));
    assert(!rangeset.contains(12));

    expect(() => rangeset.contains(1.4)).to.throw(Error);
    expect(() => rangeset.contains(new range.FloatRangeSet([]))).to.throw(Error);
  });

  it('Tests add', function() {
    const rangeset = new range.DateRangeSet([new range.DateRange({ lower: '2000-01-01', upper: '2000-01-15'})]);
    const secondRangeSet = rangeset.copy();
    secondRangeSet.add(new range.DateRange({ lower: '2000-01-05', upper: '2000-01-15'}));
    
    assert(rangeset.isEqual(secondRangeSet));
  });
});
