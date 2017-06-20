const IntRangeSet = require('../src/RangeSets').IntRangeSet;
const IntRange = require('../src/DiscreteRanges').IntRange;
describe('IntRangeSet', function() {
  it('Initial tests', function() {
    let set = new IntRangeSet();
    let range = new IntRange({ lower: 1, upper :10 });
    let range2 = new IntRange({ lower: 5, upper: 18 });
    let range3 = new IntRange({ lower: 1000, upper: 2000 });
    let i;
    set.add(range);
    set.add(range2);
    set.add(range3);
    set.remove(range);
    let set2 = new IntRangeSet();
    set2.add(range);
    set2.add(range2);
    set2.add(new IntRange({ lower: 1000, upper: 1002 }));
    set.add(range);
    for (i = 0; i < set._list.length; i += 1) {
      console.log(set._list[i]);
    }
    console.log('---------------------');
    const intersection = set.intersection(set2);
    for (i = 0; i < set2._list.length; i += 1) {
      console.log(set2._list[i]);
    }
    console.log('---------------------');
    for (i = 0; i < intersection._list.length; i += 1) {
      console.log(intersection._list[i]);
    }
  });
});
