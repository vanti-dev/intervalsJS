const assert = require('chai').assert;
const range = require('../intervalsJS.js');
const expect = require('chai').expect;


describe('FloatRange', function() {
  let FloatRange;
  let secondFloatRange;

  it('tests types', function() {
    expect(() => FloatRange = new range.FloatRange({lower: 'foo', upper: 1.2})).to.throw(Error);
    expect(() => FloatRange = new range.FloatRange({lower: 1.2, upper: 'bar'})).to.throw(Error);
  });

  it('tests less than', function() {
    FloatRange = new range.FloatRange({lower: 1.5});
    secondFloatRange = new range.FloatRange({lower: 1.5, lowerInc: false});
    assert(!FloatRange.startsAfter(secondFloatRange));
  });

  it('tests contains', function() {
    FloatRange = new range.FloatRange({lower: -6.3, upper: 15.3});
    secondFloatRange = new range.FloatRange({lower: 1.3, upper: 7.8});
    assert(FloatRange.contains(secondFloatRange));
  });

  it('tests startswith', function() {
    FloatRange = new range.FloatRange({lower: 2.5, lowerInc: false});
    secondFloatRange = new range.FloatRange({lower: 2.5});

    assert(!FloatRange.startsWith(2.5));
    assert(!FloatRange.startsWith(secondFloatRange));
  });

  it('tests endsWith', function() {
    FloatRange = new range.FloatRange({upper: 2.5, upperInc: true});
    secondFloatRange = new range.FloatRange({upper: 2.5});
    assert(FloatRange.endsWith(2.5));

    FloatRange.replace({upperInc: false});
    assert(!FloatRange.endsWith(2.5));
    assert(secondFloatRange.endsWith(FloatRange));
  });
});
