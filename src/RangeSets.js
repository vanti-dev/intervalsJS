const RangeSet = require('./Types/RangeSet');
const IntRange = require('./DiscreteRanges').IntRange;
const StrRange = require('./DiscreteRanges').StrRange;
const FloatRange = require('./ContinuousRanges').FloatRange;
const DateRange = require('./MomentDateRanges').DateRange;
const PeriodRange = require('./MomentDateRanges').PeriodRange;
const DateTimeRange = require('./MomentDateRanges').DateTimeRange;
const utils = require('./utils');


class IntRangeSet extends RangeSet {
  constructor(ranges = []) {
    const settings = {
      type: IntRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.DiscreteRangeSetMixin);
  }
}

class StrRangeSet extends RangeSet {
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
  constructor(ranges = []) {
    const settings = {
      type: FloatRange,
      ranges,
    };
    super(settings);
  }
}

class DateRangeSet extends RangeSet {
  constructor(ranges = []) {
    const settings = {
      type: DateRange,
      ranges,
    };
    super(settings);
    Object.assign(this, utils.DiscreteRangeSetMixin);
  }
}

class PeriodRangeSet extends RangeSet {
  constructor(ranges = []) {
    const settings = {
      type: PeriodRange,
      ranges,
    };
    super(settings);
  }
}

class DateTimeRangeSet extends RangeSet {
  constructor(ranges = []) {
    const settings = {
      type: DateTimeRange,
      ranges,
    };
    super(settings);
  }
}

module.exports = {
  IntRangeSet,
  StrRangeSet,
  FloatRangeSet,
  DateRangeSet,
  PeriodRangeSet,
  DateTimeRangeSet,
};
