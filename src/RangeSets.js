const RangeSet = require('./Types/RangeSet');
const IntRange = require('./DiscreteRanges').IntRange;
const StrRange = require('./DiscreteRanges').StrRange;
const FloatRange = require('./ContinuousRanges').FloatRange;
const DateRange = require('./MomentDateRanges').DateRange;
const DateTimeRange = require('./MomentDateRanges').DateTimeRange;
const utils = require('./utils');


class IntRangeSet extends RangeSet {
  /**
  @class IntRangeSet
  @extends RangeSet
  @description RangeSet that operates on ints.
  @param {array} [ranges=[]] - The Ranges to include in the set.
  @mixes OffsetableRangeSetMixin
  @mixes DiscreteRangeSetMixin
  */
  constructor(ranges = []) {
    const settings = {
      type: IntRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.DiscreteRangeSetMixin);
    Object.assign(this, utils.OffsetableRangeSetMixin);
  }
}

class StrRangeSet extends RangeSet {
  /**
  @class StrRangeSet
  @extends RangeSet
  @description RangeSet that operates on strings.
  @param {array} [ranges=[]] - The Ranges to include in the set.
  @mixes DiscreteRangeSetMixin
  */
  constructor(ranges = []) {
    const settings = {
      type: StrRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.DiscreteRangeSetMixin);
  }
}

class FloatRangeSet extends RangeSet {
  /**
  @class FloatRangeSet
  @extends RangeSet
  @description RangeSet that operates on floats.
  @param {array} [ranges=[]] - The Ranges to include in the set.
  @mixes OffsetableRangeSetMixin
  */
  constructor(ranges = []) {
    const settings = {
      type: FloatRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.OffsetableRangeSetMixin);
  }
}

class DateRangeSet extends RangeSet {
  /**
  @class DateRangeSet
  @extends RangeSet
  @description RangeSet that operates on Dates.
  @param {array} [ranges=[]] - The Ranges to include in the set.
  @mixes OffsetableRangeSetMixin
  @mixes DiscreteRangeSetMixin
  */
  constructor(ranges = []) {
    const settings = {
      type: DateRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.DiscreteRangeSetMixin);
    Object.assign(this, utils.OffsetableRangeSetMixin);
  }
}

class DateTimeRangeSet extends RangeSet {
  /**
  @class DateTimeRangeSet
  @extends RangeSet
  @description RangeSet that operates on DateTimes.
  @param {array} [ranges=[]] - The Ranges to include in the set.
  @mixes OffsetableRangeSetMixin
  */
  constructor(ranges = []) {
    const settings = {
      type: DateTimeRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.OffsetableRangeSetMixin);
  }
}

module.exports = {
  IntRangeSet,
  StrRangeSet,
  FloatRangeSet,
  DateRangeSet,
  DateTimeRangeSet,
};
