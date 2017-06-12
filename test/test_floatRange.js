const assert = require('chai').assert;
const range = require('../main.js');
const expect = require('chai').expect;


describe('floatRange', function() {
  let floatRange;
  let secondFloatRange;

  it('tests types', function() {
    expect(() => floatRange = new range.floatRange({lower: 'foo', upper: 1.2})).to.throw(Error);
    expect(() => floatRange = new range.floatRange({lower: 1.2, upper: 'bar'})).to.throw(Error);
  });

  it('tests less than', function() {
    floatRange = new range.floatRange({lower: 1.5});
    secondFloatRange = new range.floatRange({lower: 1.5, lowerInc: false});
    assert(!floatRange.startsAfter(secondFloatRange));
  });

  it('tests contains', function() {
    floatRange = new range.floatRange({lower: -6.3, upper: 15.3});
    secondFloatRange = new range.floatRange({lower: 1.3, upper: 7.8});
    assert(floatRange.contains(secondFloatRange));
  });

  it('tests startswith', function() {
    floatRange = new range.floatRange({lower: 2.5, lowerInc: false});
    secondFloatRange = new range.floatRange({lower: 2.5});

    assert(!floatRange.startsWith(2.5));
    assert(!floatRange.startsWith(secondFloatRange));
  });

  it('tests endsWith', function() {
    floatRange = new range.floatRange({upper: 2.5, upperInc: true});
    secondFloatRange = new range.floatRange({upper: 2.5});
    assert(floatRange.endsWith(2.5));

    floatRange.replace({upperInc: false});
    assert(!floatRange.endsWith(2.5));
    assert(secondFloatRange.endsWith(floatRange));
  });
});
