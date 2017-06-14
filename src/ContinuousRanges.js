const Range = require('./RangeTypes/Range.js');
const utils = require('./utils');


class floatRange extends Range {
  /**
  @class floatRange
  @extends Range
  @description Range that operates on float.
  @param {object} settings - The settings of the range.
  @param {float} [settings.lower=null] - The lower end of the range
  @param {float} [settings.upper=null] - The upper end of the range
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
  @mixes OffsetableRangeMixin
  */
  constructor(settings = {}) {
    settings.type = 'float';
    super(settings);
    Object.assign(this, utils.OffsetableRangeMixin);
    /**
    @memberof floatRange
    @description The type of values in the range.
    */
    this.type = settings.type;
  }
}

class timedeltaRange extends Range {
  constructor(settings = {}) {
    super(settings);
    Object.assign(this, utils.OffsetableRangeMixin);
    this.type = 'timedelta';
  }
}

class datetimeRange extends Range {
  constructor(settings = {}) {
    super(settings);
    this.type = 'timedelta';
  }
}

module.exports = {
  floatRange,
  timedeltaRange,
  datetimeRange,
};
