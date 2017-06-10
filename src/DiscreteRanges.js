var RangeClass = require("./Range.js");
var utils = require("./utils");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true]);

class DiscreteRange extends RangeClass {
    /**
    @class DiscreteRange
    @extends RangeClass
    @description Discrete ranges are a subset of ranges that work on discrete types. This includes `int` and `datetime.date`.
    * Discrete ranges are iterable. Using: let x of intrange.
    @param {object} settings - The settings of the range.
    @param {scalar} settings.lower - The lower end of the range
    @param {scalar} settings.upper - The upper end of the range
    @param {scalar} settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param {scalar} settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
    */
    constructor(step, settings = {}) {
        super(settings);
        this.step = step;
        var lb = this.lower;
        if (this.lower && !this.lowerInc) {
            lb = this.next(lb);
        }

        var ub = this.upper;
        if (this.upper && this.upperInc) {
            ub = this.next(ub);
        }
        if (this.lower && this.upper && lb >= ub) {
            this._range = _emptyInternalRange;
            this.replace({upper: null, lower: null, lowerInc: false, upperInc: false});
        }
        else {
            this._range = _internalRange([lb, ub, true, false, false]);
            this.replace({upper: ub, lower: lb, lowerInc: true, upperInch: false});
        }

    }
    /**
    @memberof DiscreteRange
    @method next
    @description Increment the given value with the step defined for this class.
    @param {scalar} curr -Value to increment
    @param {scalar} step - How much to step by each time. OPTIONAL (defaults to whatever is appropriate for the current range, for ints it is 1).
    @returns {scalar}
    */
    next(curr, step=1) {
        if (!this) { return curr + step; }
        return curr + this.step;
    }

    [Symbol.iterator]() {
        var nextFunc = this.next;
        var start = this.prev(this.lower);
        var last = this.last();
        var step = this.step;
        let iterator = {
            next()  {
                start = nextFunc(start, step);
                var bool = (start) > last;
                return {
                    value: start,
                    done: bool
                };
            }
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
        else {
            return this.prev(this.upper);
        }
    }

    endsWith(other) {
        //Discrete ranges have a lst element even in cases where the UB is null
        if (this.isValidScalar(other)) {
            return this.last() === other;
        }
        else {
            return super.endsWith(other);
        }
    }
}

class intRange extends DiscreteRange {
    /**
    @class intRange
    @extends DiscreteRange
    @description Range that operates on int.
    @param {object} settings - The settings of the range.
    @param {int} settings.lower - The lower end of the range
    @param {int} settings.upper - The upper end of the range
    @param {int} settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param {int} settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
    @mixes OffsetableRangeMixin
    */
    constructor(settings = {}) {
        settings.type = "int";
        super(1, settings);
        Object.assign(this, utils.OffsetableRangeMixin);
        /**
        @memberof intRange
        @description The type of values in the range.
        */
        this.type = settings.type;
    }
    /**
    @memberof intRange
    @method length
    @description Return the length of the range
    @returns {scalar}
    */
    length() {
        return this.upper - this.lower;
    }
}

class strRange extends DiscreteRange {
    /**
    @class strRange
    @extends DiscreteRange
    @description Range that operates on strings.
    @param {object} settings - The settings of the range.
    @param {string} settings.lower - The lower end of the range
    @param {string} settings.upper - The upper end of the range
    @param {string} settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param {string} settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
    */
    constructor(settings={}) {
        settings.type = "ustr";
        super(1, settings);
        /**
        @memberof strRange
        @description The type of values in the range.
        */
        this.type = settings.type;
    }
    /**
    @memberof strRange
    @method next
    @description Increment the given value with the step defined for this class.
    @param {string} curr - Value to increment
    @returns {scalar}
    */
    next(curr) {
        if (!curr) {
            return "";
        }
        var last = curr.substr(curr.length - 1);

        if (last.charCodeAt() === 65535) {
                return this.next(curr.slice(0,-1)) + String.fromCharCode(0);
        }
        else {
            return curr.slice(0,-1) + String.fromCharCode(last.charCodeAt()+1);
        }
    }
    /**
    @memberof strRange
    @method prev
    @description decrement the given value with the step defined for this class.
    @param {string} curr - Value to decrement
    @returns {string}
    */
    prev(curr) {
        if (!curr) {
            return "";
        }

        var last = curr.substr(curr.length - 1);

        if (last.charCodeAt() === 0) {
            return this.prev(curr.slice(0,-1)) + String.fromCharCode(65535);
        }
        else {
            return curr.slice(0,-1) + String.fromCharCode(last.charCodeAt()-1);
        }
    }
}

class dateRange extends DiscreteRange {
    constructor(settings = {}) {
        super(1, settings);
        this.type = "date";
        //Work from here
    }
}

class PeriodRange extends dateRange {
    constructor(settings = {}) {
        super(1, settings);
        //Work from here
    }
}

module.exports = {
    intRange: intRange,
    strRange: strRange,
    dateRange: dateRange,
    PeriodRange: PeriodRange
};
