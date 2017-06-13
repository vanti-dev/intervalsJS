const Range = require('./Range.js');
const utils = require('./utils');

const _internalRange = utils.namedList(['lower', 'upper', 'lowerInc', 'upperInc', 'empty']);
const _emptyInternalRange = _internalRange([null, null, false, false, true]);

class DiscreteRange extends Range {
  /**
  @class DiscreteRange
  @extends Range
  @description Discrete ranges are a subset of ranges that work
  on discrete types. This includes `int` and `datetime.date`.
  * Discrete ranges are iterable. Using: let x of IntRange.
  @param {object} settings - The settings of the range.
  @param {scalar} [settings.lower=null] - The lower end of the range
  @param {scalar} [settings.upper=null] - The upper end of the range
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
  */
  constructor(step, settings = {}) {
    super(settings);
    this.step = step;
    let lb = this.lower;
    if (this.lower && !this.lowerInc) {
      lb = this.next(lb);
    }

    let ub = this.upper;
    if (this.upper && this.upperInc) {
      ub = this.next(ub, this.step, settings.type);
    }
    if (this.lower && this.upper && lb >= ub) {
      this._range = _emptyInternalRange;
      this.replace({ upper: null, lower: null, lowerInc: false, upperInc: false });
    } else {
      this._range = _internalRange([lb, ub, true, false, false]);
      this.replace({ upper: ub, lower: lb, lowerInc: true, upperInc: false });
    }
  }
  /**
  @memberof DiscreteRange
  @method next
  @description Increment the given value with the step defined for this class.
  @param {scalar} curr -Value to increment
  @param {scalar} step - How much to step by each time. OPTIONAL (defaults to
  whatever is appropriate for the current range, for ints it is 1).
  @returns {scalar}
  */
  next(curr, step = 1) {
    if (this) {
      step = this.step ? this.step : step;
    }
    return curr + step;
  }

  [Symbol.iterator]() {
    const nextFunc = this.next;
    const last = this.last();
    const step = this.step;
    let start = this.prev(this.lower, step);
    const iterator = {
      next() {
        start = nextFunc(start, step);
        const bool = (start) > last;
        return {
          value: start,
          done: bool,
        };
      },
    };
    return iterator;
  }
  /**
  @memberof DiscreteRange
  @method prev
  @description Decrement the given value with the step defined for this class.
  @param {scalar} curr -Value to decrement
  @returns {scalar}
  */
  prev(curr) {
    return curr - this.step;
  }
  /**
  @memberof DiscreteRange
  @method last
  @description Returns the last element within this range. If the range has no
  upper limit, `null` is returned.
  @returns {scalar}
  */
  last() {
    if (!this || !this.upper) {
      return null;
    }
    return this.prev(this.upper, this.step, this.type);
  }

  endsWith(other) {
    // Discrete ranges have a lst element even in cases where the UB is null
    if (this.isValidScalar(other)) {
      return this.last() === other;
    }
    return super.endsWith(other);
  }
}

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
