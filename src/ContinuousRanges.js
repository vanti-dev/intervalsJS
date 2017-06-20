const Range = require('./Types/Range.js');
const utils = require('./utils');


class FloatRange extends Range {
  /**
  @class FloatRange
  @extends Range
  @description Range that operates on float.
  @param {object} settings - The settings of the range.
  @param {number} [settings.lower=null] - The lower end of the range
  @param {number} [settings.upper=null] - The upper end of the range
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
  @mixes OffsetableRangeMixin
  */
  constructor(settings = {}) {
    settings.type = 'float';
    super(settings);
    Object.assign(this, utils.OffsetableRangeMixin);
    /**
    @memberof FloatRange
    @description The type of values in the range.
    */
    this.type = settings.type;
  }

  isValidScalar(scalar) {
    return !isNaN(scalar);
  }
}

module.exports = {
  FloatRange,
};
