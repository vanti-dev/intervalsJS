var RangeClass = require("./Range.js");
var utils = require("./utils");
var moment = require("moment");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true]);

class DiscreteRange extends RangeClass {
    /**
    @class DiscreteRange
    @extends RangeClass
    @description Discrete ranges are a subset of ranges that work on discrete types. This includes `int` and `datetime.date`.
    * Discrete ranges are iterable. Using: let x of intrange.
    @param {object} settings - The settings of the range.
    @param {scalar} [settings.lower=null] - The lower end of the range
    @param {scalar} [settings.upper=null] - The upper end of the range
    @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
    @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
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

            ub = this.next(ub,this.step, settings.type);
        }
        if (this.lower && this.upper && lb >= ub) {
            this._range = _emptyInternalRange;
            this.replace({upper: null, lower: null, lowerInc: false, upperInc: false});
        }
        else {
            this._range = _internalRange([lb, ub, true, false, false]);
            this.replace({upper: ub, lower: lb, lowerInc: true, upperInc: false});
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
    next(curr, step=1, type="") {
        if (this) {
            step = this.step ? this.step : step;
            type = this.type ? this.type : type;
        }
        if (type === "date") {  return curr.add(1, step); }
        return curr + step;
    }

    [Symbol.iterator]() {
        var nextFunc = this.next;
        var last = this.last();
        var step = this.step;
        var type = this.type;
        var start = this.prev(this.lower, step, type);
        let iterator = {
            next()  {
                start = nextFunc(start, step, type);
                var bool = type === 'date' ? start.isAfter(last) : (start) > last;
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
    prev(curr, step, type) {
        if (type === "date") { return curr.subtract(1, step); }
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
            return this.prev(this.upper, this.step, this.type);
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
    @param {int} [settings.lower=null] - The lower end of the range
    @param {int} [settings.upper=null] - The upper end of the range
    @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
    @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
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
    @param {string} [settings.lower=null] - The lower end of the range
    @param {string} [settings.upper=null] - The upper end of the range
    @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
    @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
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
    /**
    @class dateRange
    @extends DiscreteRange
    @description Range that operates on dates.
    @param {object} settings - The settings of the range.
    @param {string} [settings.lower=null] - The lower end of the range - Formatted as either "YYYY-MM-DD" or "MM-DD-YYYY"
    @param {string} [settings.upper=null] - The upper end of the range - Formatted as either "YYYY-MM-DD" or "MM-DD-YYYY"
    @param {boolean} [settings.lowerInc=true] - ``true`` if lower end should be included in range.
    @param {boolean} [settings.upperInc=false] ``true`` if upper end should be included in range.
    */

    constructor(settings = {}) {
        if (Object.keys(settings).length !== 0 && settings.lowe &&  !utils.isValidDate(settings.lower)) {
            throw new Error("Invalid type of lower bound");
        }

        if (Object.keys(settings).length !== 0 && settings.upper && !utils.isValidDate(settings.upper)) {
            throw new Error("Invalid type of upper bound");
        }
        settings.type = "date";
        super('day', settings);
        /**
        @memberof dateRange
        @description The type of values in the range.
        */
        this.type = settings.type;
        Object.assign(this, utils.OffsetableRangeMixin);
        this.offsetType = "duration";
        /**
        @memberof dateRange
        @description How far to step when iterating.
        */
        this.step = 'day';
    }

    /**
    @memberof dateRange
    @method fromDate
    @description Returns a dateRange with length period beginning at date.
    @param {string} date A date to begin the range from.  Formatted as either "YYYY-MM-DD" or "MM-DD-YYYY"
    @param {string} [period="day"] How long the range should be. Options: "day", "week", "month", "quarter", "year"
    @returns {range}
    */

    fromDate(date, period="day") {
        var start;
        if (period === "day") {
            return new dateRange({lower:date, upper: date, upperInc: true});
        }
        if (period === "week") {
            date = moment(date, "MM-DD-YYYY").isValid() ? moment(date, "MM-DD-YYYY") : moment(date, "YYYY-MM-DD");
            var subtract = date.day()-1;
            if (date.day() === 0) { subtract = 6; }
            else if (date.day() === 1) { subtract = 1; }
            start = date.subtract(subtract, "days");
            return new dateRange({lower: start.format("YYYY-MM-DD"), upper: start.add(1, "week").format("YYYY-MM-DD")});
        }
        if (period === "americanWeek") {
            date = moment(date, "MM-DD-YYYY").isValid() ? moment(date, "MM-DD-YYYY") : moment(date, "YYYY-MM-DD");
            start = date.subtract(date.day(), "days");
            return new dateRange({lower: start.format("YYYY-MM-DD"), upper: start.add(1, "week").format("YYYY-MM-DD")});
        }
        if (period === "month") {
            date = moment(date, "MM-DD-YYYY").isValid() ? moment(date, "MM-DD-YYYY") : moment(date, "YYYY-MM-DD");
            start = date.date(1);
            return new dateRange({lower: start.format("YYYY-MM-DD"), upper: start.add(1, "month").date(1).format("YYYY-MM-DD")});
        }
        if (period === "quarter") {
            date = moment(date, "MM-DD-YYYY").isValid() ? moment(date, "MM-DD-YYYY") : moment(date, "YYYY-MM-DD");
            start = date.month(Math.floor(date.month()/3) * 3).date(1);
            return new dateRange({lower: start.format("YYYY-MM-DD"), upper: start.add(3, "month").date(1).format("YYYY-MM-DD")});
        }
        if (period === "year") {
            date = moment(date, "MM-DD-YYYY").isValid() ? moment(date, "MM-DD-YYYY") : moment(date, "YYYY-MM-DD");
            start = date.month(0).date(1);
            return new dateRange({lower: start.format("YYYY-MM-DD"), upper: start.add(1, 'year').format("YYYY-MM-DD")});
        }
        else {
            throw new Error("Unexpected period.");
        }
    }
    /**
    @memberof dateRange
    @method length
    @description Return the length of the range
    @returns {scalar}
    */
    length() {
        if (!this.upper || !this.lower) {
            throw new Error("Unbounded ranges do not have a length");
        }
        else {
            return Math.round(moment.duration(this.upper.diff(this.lower)).asDays());
        }
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
