const utils = require('./utils');
const moment = require('moment');
const MomentDateRange = require('./RangeTypes/MomentDateRange');

const _internalRange = utils.namedList(['lower', 'upper', 'lowerInc', 'upperInc', 'empty']);
const _emptyInternalRange = _internalRange([null, null, false, false, true]);

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
  /**
  @memberof DateRange
  @method next
  @description Increment the given value with the step defined for this class.
  @param {scalar} curr -Value to increment
  @param {string} step - How much to step by each time. OPTIONAL (defaults to
  whatever is appropriate for the current range, for dates it is 'day').
  @returns {scalar}
  */
  next(curr, step = 'day') {
    if (this) {
      step = this.step ? this.step : step;
    }
    return curr.add(1, step);
  }
  /**
  @memberof DateRange
  @method prev
  @description Decrement the given value with the step defined for this class.
  @param {scalar} curr -Value to decrement
  @param {string} step - How much to step by each time. OPTIONAL (defaults to
  whatever is appropriate for the current range, for dates it is 'day').
  @returns {scalar}
  */
  prev(curr, step = 'day') {
    return curr.subtract(1, step);
  }

  last() {
    if (!this || !this.upper) {
      return null;
    }
    return this.prev(this.upper, this.step);
  }

  endsWith(other) {
    // Date ranges have a last element even in cases where the UB is null
    if (moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      const last = this.last();
      const test = moment(other, ['MM-DD-YYYY', 'YYYY-MM-DD']);
      return last.isSame(test);
    }
    return super.endsWith(other);
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
  @returns {number}
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

  nextPeriod() {
    return this.fromDate(this.upper.format(), this.period);
  }

  prevPeriod() {
    return this.fromDate(this.prev(this.lower), this.period);
  }

  union(other) {
    return this.daterange.union(other);
  }

  intersection(other) {
    return this.daterange.intersection(other);
  }

  difference(other) {
    return this.daterange.difference(other);
  }

}

class DateTimeRange extends MomentDateRange {
  constructor(settings = {}) {
    super(settings);
    this.type = 'timedelta';
  }
}

module.exports = {
  DateRange,
  PeriodRange,
  DateTimeRange,
};
