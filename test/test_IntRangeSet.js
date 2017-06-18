const IntRangeSet = require('../src/RangeSets');
const IntRange = require('../src/DiscreteRanges').IntRange;
describe('IntRangeSet', function() {
  it('Initial tests', function() {
    let set = new IntRangeSet();
    let range = new IntRange({ lower: 1, upper :10 });
    let range2 = new IntRange({ lower: 5, upper: 18 });
    let range3 = new IntRange({ lower: 1000, upper: 2000 });
    set.add(range);
    set.add(range2);
    set.add(range3);
    set.remove(range);
    console.log(set.span());
  });
});
