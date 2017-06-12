const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;

describe('IntRange', function() {

  it('tests length', function() {
    let IntRange = new range.IntRange({lower:0, upper:5});

    assert(IntRange.length() === 5);
  });

  it('tests offset', function() {
    let IntRange = new range.IntRange({lower: 5, upper: 10});
    let notARange = null;

    IntRange.offset(-5);
    assert(IntRange.upper === 5);
    assert(IntRange.lower === 0);

    expect(() => IntRange.offset('a')).to.throw(Error);
  });


  it('tests iteration', function() {
    let IntRange = new range.IntRange({lower: 5, upper: 10});
    let i=5;
    for (let x  of IntRange) {
        assert(x === i && i < IntRange.upper);
        i++;
    }
  });
});
