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
});
