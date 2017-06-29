const assert = require('chai').assert;
const range = require('../intervalJS.js');

describe('StrRange', function() {

  it('tests next', function () {
    let StrRange = new range.StrRange({lower: 'a', upper: 'c'});

    assert(StrRange.next('a') === 'b');
    assert(StrRange.next('abc') === 'abd');
    assert(StrRange.next('AbC') === 'AbD');

    assert(StrRange.next() === '');
  });

  it('tests prev', function () {
    let StrRange = new range.StrRange({lower: 'd', upper: 'e'});

    assert(StrRange.prev('d') === 'c');
    assert(StrRange.prev('7') === '6');
    assert(StrRange.prev('AbC') === 'AbB');
    assert(StrRange.prev() === '');
  });

  it('tests last', function () {
    let StrRange = new range.StrRange({ lower: 'd', upper: 'k' });
    let noLast = new range.StrRange({ lower: 'h' });

    assert(noLast.last() === null);

    assert(StrRange.last() === 'j');
  });
});
