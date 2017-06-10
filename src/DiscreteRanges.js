var RangeClass = require("./Range.js");
var utils = require("./_utils");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true]);

class DiscreteRange extends RangeClass {
    /**
    @class DiscreteRange
    @extends RangeClass
    Discrete ranges are a subset of ranges that work on discrete types. This includes `int` and `datetime.date`
    @param {object} settings - The settings of the range.
    @param {object|scalar} settings.lower - The lower end of the range
    @param {object|scalar} settings.upper - The upper end of the range
    @param {object|scalar} settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param {object|scalar} settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
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
    @returns {scalar}
    */
    next(curr) {
        return curr + this.step;
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
    constructor(settings = {}) {
        super(1, settings);
        Object.assign(this, utils.OffsetableRangeMixin);
        this.type = "int";
    }

    length() {
        return this.upper - this.lower;
    }
}

class strRange extends DiscreteRange {
    constructor(settings={}) {
        super(1, settings);
        this.type = "ustr";
    }
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
