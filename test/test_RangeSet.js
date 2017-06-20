const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('IntRangeSet', function() {
  it('Tests Empty', function() {
    assert(new range.IntRangeSet([]).isEmpty);
  });
});
