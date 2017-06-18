const RangeSet = require('./Types/RangeSet');
const IntRange = require('./DiscreteRanges').IntRange;


class IntRangeSet extends RangeSet {
  constructor(ranges = []) {
    const settings = {
      type: IntRange,
      ranges,
    };
    super(settings);
  }
}

module.exports = IntRangeSet;
