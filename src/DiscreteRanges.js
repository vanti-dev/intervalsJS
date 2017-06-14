const utils = require('./utils');
const DiscreteRange = require('./RangeTypes/DiscreteRange');

class IntRange extends DiscreteRange {
  /**
  @class IntRange
  @extends DiscreteRange
  @description Range that operates on int.
  @param {object} settings - The settings of the range.
  @param {int} [settings.lower=null] - The lower end of the range
  @param {int} [settings.upper=null] - The upper end of the range
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
  @mixes OffsetableRangeMixin
  */
  constructor(settings = {}) {
    settings.type = 'int';
    super(1, settings);
    Object.assign(this, utils.OffsetableRangeMixin);
    /**
    @memberof IntRange
    @description The type of values in the range.
    */
    this.type = settings.type;
  }
  /**
  @memberof IntRange
  @method length
  @description Return the length of the range
  @returns {scalar}
  */
  length() {
    return this.upper - this.lower;
  }
}

class StrRange extends DiscreteRange {
  /**
  @class StrRange
  @extends DiscreteRange
  @description Range that operates on strings.
  @param {object} settings - The settings of the range.
  @param {string} [settings.lower=null] - The lower end of the range
  @param {string} [settings.upper=null] - The upper end of the range
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
  */
  constructor(settings = {}) {
    settings.type = 'str';
    super(1, settings);
    /**
    @memberof StrRange
    @description The type of values in the range.
    */
    this.type = settings.type;
  }
  /**
  @memberof StrRange
  @method next
  @description Increment the given value with the step defined for this class.
  @param {string} curr - Value to increment
  @returns {scalar}
  */
  next(curr) {
    if (!curr) {
      return '';
    }
    const last = curr.substr(curr.length - 1);

    if (last.charCodeAt() === 65535) {
      return this.next(curr.slice(0, -1)) + String.fromCharCode(0);
    }
    return curr.slice(0, -1) + String.fromCharCode(last.charCodeAt() + 1);
  }
  /**
  @memberof StrRange
  @method prev
  @description decrement the given value with the step defined for this class.
  @param {string} curr - Value to decrement
  @returns {string}
  */
  prev(curr) {
    if (!curr) {
      return '';
    }

    const last = curr.substr(curr.length - 1);

    if (last.charCodeAt() === 0) {
      return this.prev(curr.slice(0, -1)) + String.fromCharCode(65535);
    }
    return curr.slice(0, -1) + String.fromCharCode(last.charCodeAt() - 1);
  }
}


module.exports = {
  IntRange,
  StrRange,
};
