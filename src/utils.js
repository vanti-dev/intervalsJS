const moment = require('moment');

const OffsetableRangeMixin = {
  /**
  * This provides methods used for event offsetting a range.
  * It also includes the offsetType member.
  *
  * @mixin OffsetableRangeMixin
  */

  /**
  * @member offsetType
  * @memberof OffsetableRangeMixin
  * @description The type of value used to offset
  */
  offsetType: null,

  /**
  @memberof OffsetableRangeMixin
  @method offset
  @description Offset the range by the given value.
  @param {number} offset -How much to offset by
  @returns {object}
  */
  offset(offset) {
    if (this.constructor.name === 'PeriodRange') {
      let i;
      let span = this;
      if (offset > 0) {
        for (i = 0; i <= offset; i += 1) {
          span = span.nextPeriod();
        }
      } else {
        for (i = 0; i <= -offset; i += 1) {
          span = span.prevPeriod();
        }
      }
      return span;
    }
    let upper;
    let lower;
    if (offset && !this.isValidScalar(offset)) {
      throw new Error('Invalid type for offset');
    }
    if (this.type === 'date') {
      upper = this.upper ? this.upper.add(offset) : null;
      lower = this.lower ? this.lower.add(offset) : null;
    } else {
      upper = this.upper ? this.upper + offset : null;
      lower = this.lower ? this.lower + offset : null;
    }

    return this.replace({ upper, lower });
  },
};

function addToList(value, list) {
  list.push(value);
}

const DiscreteRangeSetMixin = {
  values() {
    let i;
    const output = [];
    for (i = 0; i < this._list.length; i += 1) {
      for (const x of this._list[i]) {
        addToList(x, output);
      }
    }
    return output;
  },
};

function namedList(fields) {
  // Emulating pythons Named Tuples
  return function (arr) {
    const obj = { };
    let i;

    for (i = 0; i < arr.length; i += 1) {
      obj[fields[i]] = arr[i];
    }

    return obj;
  };
}

function isValidDate(data) {
  return typeof data !== 'number' && (moment(data, 'MM-DD-YYYY').isValid() || moment(data, 'YYYY-MM-DD').isValid());
}

function getType(data) {
  if (typeof data === 'number') {
    if ((!isNaN(data) && data.toString().indexOf('.') !== -1)) {
      return 'float';
    } else if (data % 1 === 0) {
      return 'int';
    }
  } else {
    if (moment.isDuration(data) || isValidDate(data)) { return 'date'; }
    return 'str';
  }
  return null;
}

module.exports = {
  OffsetableRangeMixin,
  DiscreteRangeSetMixin,
  namedList,
  getType,
  isValidDate,
};
