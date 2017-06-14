const Range = require('./Range.js');
const utils = require('./utils');
const moment = require('moment');


const _internalRange = utils.namedList(['lower', 'upper', 'lowerInc', 'upperInc', 'empty']);
const _emptyInternalRange = _internalRange([null, null, false, false, true]);

class MomentDateRange extends Range {
  constructor(settings) {
    settings.type = 'date';
    if (settings.upper && typeof settings.upper === 'string') {
      settings.upper = moment(settings.upper, 'MM-DD-YYYY').isValid() ? moment(settings.upper, 'MM-DD-YYYY') : moment(settings.upper, 'YYYY-MM-DD');
    }
    if (settings.lower && typeof settings.lower === 'string') {
      settings.lower = moment(settings.lower, 'MM-DD-YYYY').isValid() ? moment(settings.lower, 'MM-DD-YYYY') : moment(settings.lower, 'YYYY-MM-DD');
    }
    super(settings);
  }

  isEqual(other) {
    if (!this || !other || !this.isValidRange(other)) {
      return false;
    }
    return this.upper.isSame(other.upper) &&
    this.lower.isSame(other.lower) && this.lowerInc === other.lowerInc &&
    this.upperInc === other.upperInc;
  }

  replace(settings = {}) {
    if (settings.upper && typeof settings.upper === 'string') {
      this._range.upper = moment(settings.upper, 'MM-DD-YYYY').isValid() ? moment(settings.upper, 'MM-DD-YYYY') : moment(settings.upper, 'YYYY-MM-DD');
    }
    if (settings.lower && typeof settings.lower === 'string') {
      this._range.lower = moment(settings.lower, 'MM-DD-YYYY').isValid() ? moment(settings.lower, 'MM-DD-YYYY') : moment(settings.lower, 'YYYY-MM-DD');
    }
    if (settings.lowerInc !== undefined) {
      this._range.lowerInc = settings.lowerInc;
    }
    if (settings.upperInc !== undefined) {
      this._range.upperInc = settings.upperInc;
    }
    return this;
  }

  contains(other) {
    if (this.isValidRange(other)) {
      if (!other || (other.startsAfter(this) && other.endsBefore(this))) {
        return true;
      }
      return false;
    } else if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      let isInLower = true;
      if (this.lower) {
        isInLower = this.lower.isBefore(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
      }

      let isInUpper = true;
      if (this.upper) {
        isInUpper = this.upper.isSameOrAfter(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
      }

      return isInLower && isInUpper;
    }
    throw new Error('Unsupported type to test for inclusion');
  }

  startsAfter(other) {
    if (this.isValidRange(other)) {
      if (this.lower !== null && other.lower !== null && this.lower.isSame(other.lower)) {
        return other.lowerInc || !this.lowerInc;
      } else if (this.lower === null) {
        return false;
      } else if (other.lower === null) {
        return true;
      }
      return this.lower.isAfter(other.lower);
    } else if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      return this.lower.isSameOrAfter(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
    }
    throw new Error('Unsupported type to test for starts after');
  }

  endsBefore(other) {
    if (this.isValidRange(other)) {
      if (this.upper !== null && other.upper !== null && this.upper.isSame(other.upper)) {
        return other.upperInc || !this.upperInc;
      } else if (this.upper === null) {
        return false;
      } else if (other.upper === null) {
        return true;
      }
      return this.upper.isSameOrBefore(other.upper);
    } else if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      return this.upper.isSameOrBefore(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
    }
    throw new Error('Unsupported type to test for ends before');
  }

  startsWith(other) {
    if (this.isValidRange(other)) {
      if (this.lowerInc === other.lowerInc) {
        return this.lower.isSame(other.lower);
      }
      return false;
    } else if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      if (this.lowerInc) {
        return this.lower.isSame(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
      }
      return false;
    }
    throw new Error('Unsupported type to test for starts with');
  }

  endsWith(other) {
    if (this.isValidRange(other)) {
      if (this.upperInc === other.upperInc) {
        return this.upper.isSame(other.upper);
      }
      return false;
    } else if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      console.log(this);
      if (this.upperInc) {
        return this.upper.isSame(moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']));
      }
      return false;
    }
    throw new Error('Unsupported type to test for ends with');
  }
}

class DateRange extends MomentDateRange {
  /**
  @class DateRange
  @extends MomentDateRange
  @description Range that operates on dates.
  @param {object} settings - The settings of the range.
  @param {string} [settings.lower=null] - The lower end of the range -
  Formatted as either 'YYYY-MM-DD' or 'MM-DD-YYYY'
  @param {string} [settings.upper=null] - The upper end of the range -
   Formatted as either 'YYYY-MM-DD' or 'MM-DD-YYYY'
  @param {boolean} [settings.lowerInc=true] - ``true`` if lower
  end should be included in range.
  @param {boolean} [settings.upperInc=false] ``true`` if upper
  end should be included in range.
  */

  constructor(settings = {}) {
    if (Object.keys(settings).length !== 0 && settings.lower &&
                                      !utils.isValidDate(settings.lower)) {
      throw new Error('Invalid type of lower bound');
    }

    if (Object.keys(settings).length !== 0 && settings.upper &&
                                      !utils.isValidDate(settings.upper)) {
      throw new Error('Invalid type of upper bound');
    }
    settings.type = 'date';
    super(settings);
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
    /**
    @memberof DateRange
    @description The type of values in the range.
    */
    this.type = settings.type;
    Object.assign(this, utils.OffsetableRangeMixin);
    this.offsetType = 'duration';
    /**
    @memberof DateRange
    @description How far to step when iterating.
    */
    this.step = 'day';
  }

  next(curr, step = 'day') {
    if (this) {
      step = this.step ? this.step : step;
    }
    return curr.add(1, step);
  }

  prev(curr, step) {
    return curr.subtract(1, step);
  }

  last() {
    if (!this || !this.upper) {
      return null;
    }
    return this.prev(this.upper, this.step);
  }

  endsWith(other) {
    // Discrete ranges have a lst element even in cases where the UB is null
    if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      const last = this.last();
      const test = moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']);
      return last.isSame(test);
    }
    return super.endsWith(other);
  }

  /**
  @memberof DateRange
  @method fromDate
  @description Returns a DateRange with length period beginning at date.
  @param {string} date A date to begin the range from.
  Formatted as either 'YYYY-MM-DD' or 'MM-DD-YYYY'
  @param {string} [period='day'] How long the range should be.
  Options: 'day', 'week', 'month', 'quarter', 'year'
  @returns {range}
  */

  fromDate(date, period = 'day') {
    let start;
    if (period === 'day') {
      return new DateRange({ lower: date, upper: date, upperInc: true });
    }
    if (period === 'week') {
      date = moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY') : moment(date, 'YYYY-MM-DD');
      let subtract = date.day() - 1;
      if (date.day() === 0) {
        subtract = 6;
      } else if (date.day() === 1) { subtract = 1; }
      start = date.subtract(subtract, 'days');
      return new DateRange({ lower: start.format('YYYY-MM-DD'), upper: start.add(1, 'week').format('YYYY-MM-DD') });
    }
    if (period === 'americanWeek') {
      date = moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY') : moment(date, 'YYYY-MM-DD');
      start = date.subtract(date.day(), 'days');
      return new DateRange({ lower: start.format('YYYY-MM-DD'), upper: start.add(1, 'week').format('YYYY-MM-DD') });
    }
    if (period === 'month') {
      date = moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY') : moment(date, 'YYYY-MM-DD');
      start = date.date(1);
      return new DateRange({ lower: start.format('YYYY-MM-DD'), upper: start.add(1, 'month').date(1).format('YYYY-MM-DD') });
    }
    if (period === 'quarter') {
      date = moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY') : moment(date, 'YYYY-MM-DD');
      start = date.month(Math.floor(date.month() / 3) * 3).date(1);
      return new DateRange({ lower: start.format('YYYY-MM-DD'), upper: start.add(3, 'month').date(1).format('YYYY-MM-DD') });
    }
    if (period === 'year') {
      date = moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY') : moment(date, 'YYYY-MM-DD');
      start = date.month(0).date(1);
      return new DateRange({ lower: start.format('YYYY-MM-DD'), upper: start.add(1, 'year').format('YYYY-MM-DD') });
    }
    throw new Error('Unexpected period.');
  }
  /**
  @memberof DateRange
  @method length
  @description Return the length of the range
  @returns {scalar}
  */
  length() {
    if (!this.upper || !this.lower) {
      throw new Error('Unbounded ranges do not have a length');
    }
    return Math.round(moment.duration(this.upper.diff(this.lower)).asDays());
  }
}

class PeriodRange extends DateRange {
  constructor(settings = {}) {
    super(settings);
  }

  fromDate(day, period = 'day') {
    const span = new DateRange().fromDate(day, period);
    const newSpan = new PeriodRange();
    newSpan._range = span._range;
    newSpan.period = period;
    return newSpan;
  }

  empty() {
    throw new Error('PeriodRange does not support empty ranges');
  }

  get daterange() {
    return new DateRange({
      lower: this.lower,
      upper: this.upper,
      lowerInc: this.lowerInc,
      upperInc: this.upperInc,
    });
  }

  isValidRange(other) {
    return other instanceof DateRange;
  }

  replace(settings) {
    return this.daterange.replace(settings);
  }
}

module.exports = {
  DateRange,
  PeriodRange,
};
