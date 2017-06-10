var utils = require("./_utils.js");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true]);

class RangeClass {
    /**
    @class RangeClass
    Abstract base class of all ranges.
    Ranges are strict about types. This means that both `lower` and `upper` must
    be of the given class or subclass, or `null`
    @param {object} settings - The settings of the range.
    @param {variable} settings.lower - The lower end of the range
    @param {variable} settings.upper - The upper end of the range
    @param {variable} settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param {variable} settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
    */
    constructor(settings = {}) {
        if (settings.upper && settings.lower && settings.upper < settings.lower) {
            throw new Error("Upper bound is less than lower bound!");
        }
         settings = {
            //Setting default values
            lower: settings.lower || null,
            upper: settings.upper || null,
            lowerInc: settings.lowerInc || true,
            upperInc: settings.upperInc || false
        };
        this._range = _internalRange([settings.lower, settings.upper, settings.lowerInc, settings.upperInc, false]);
        /**
        @memberof RangeClass
        @description The lower boundary of the set.
        */
        this.lower = this._range.lower;
        /**
        @memberof RangeClass
        @description The upper boundary of the set.
        */
        this.upper = this._range.upper;
        /**
        @memberof RangeClass
        @description ``true`` if the lower bound is included in the range. Otherwise false.
        */
        this.lowerInc = this._range.lowerInc;
        /**
        @memberof RangeClass
        @description ``true`` if the lower bound is included in the range. Otherwise false.
        */
        this.upperInc = this._range.upperInc;
    }
    /**
    @memberof RangeClass
    @method empty
    @description Returns an empty set. An empty set in unbounded and only contains the empty set.
    */
    empty() {
        this._range = _emptyInternalRange;
        return this;
    }

    /**
    @memberof RangeClass
    @method replace
    @description Returns a new instance of self with the given arguments replaced.
    @param {object} settings - The settings of the range.
    @param settings.lower - The lower end of the range
    @param settings.upper - The upper end of the range
    @param settings.lowerInc - ``true`` if lower end should be included in range. Defaults to ``true``.
    @param settings.upperInc - ``true`` if upper end should be included in range. Defautls to ``false``.
    */
    replace(settings = {}) {
        if (settings.lower !== undefined) {
            this._range.lower = settings.lower;
            this.lower = settings.lower;
        }
        if (settings.upper !== undefined) {
            this._range.upper = settings.upper;
            this.upper = settings.upper;
        }
        if (settings.lowerInc !== undefined) {
            this._range.lowerInc = settings.lowerInc;
            this.lowerInc = settings.lowerInc;
        }
        if (settings.upperInc !== undefined) {
            this._range.upperInc = settings.upperInc;
            this.upperInc = settings.upperInc;
        }
        return this;
    }

    /**
    @memberof RangeClass
    @method isValidRange
    @description Returns ``true`` if `object` is a valid range of the same type as this. Otherwise ``false``
    @param {range} obj - A range to check
    */
    isValidRange(obj) {
        return obj instanceof RangeClass;
    }
    /**
    @memberof RangeClass
    @method isValidScalar
    @description Returns ``true`` if `object` is a valid scalar of the same type as this. Otherwise ``false``
    @param {scalar} scalar - A scalar to check
    */
    isValidScalar(scalar) {
        if (this.type === "int") {
            return scalar%1 === 0;
        }
        return typeof scalar === typeof this.upper;
    }

    /**
    @memberof RangeClass
    @method contains
    @description Returns ``true`` if this contains other. Other may be either range of same type or scalar of same type as the boundaries.
    @param {variable} other - Check whether this contains other.
    */
    contains(other) {
        if (this.isValidRange(other)) {
            if (!this) {
                return !other;
            }
            else if (!other || other.startsAfter(this) && other.endsBefore(this)) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.isValidScalar(other)) {
            var isInLower = true;
            if (this.lower) {
                isInLower = (this.lower < other);
            }

            var isInUpper = true;
            if (this.upper) {
                isInUpper = (this.upper >= other);
            }

            return isInLower && isInUpper;
        }
        else {
            throw new Error("Unsupported type to test for inclusion");
        }
    }
    /**
    @memberof RangeClass
    @method overlap
    @description Returns ``true`` if this shares any points with other.
    @param {range} other - Check whether this shares any points with other.
    */
    overlap(other) {
        var a, b;
        if (!this || !other) {
            return false;
        }

        if (this.endsBefore(other)) {
            a = this;
            b = other;
        }
        else {
            a = other;
            b = this;
        }

        if (!a.upper || !b.lower) {
            return true;
        }
        return a.upper > b.lower || a.upper === b.lower && a.upperInc && b.lowerInc;
    }
    /**
    @memberof RangeClass
    @method adjacent
    @description Returns ``true`` if ranges are directly next to each other but do not overlap.
    @param {range} other - Check whether this is adjacent to other.
    */
    adjacent(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for inclusion");
        }
        else if (!this || !other) {
            return false;
        }
        return (this.lower == other.upper && this.lowerInc != other.upperInc) || (this.upper == other.lower && this.upperInc != other.lowerInc);
    }
    /**
    @memberof RangeClass
    @method union
    @description Returns a new set, containing the two ranges merged together.
    *note: wo ranges can not be merged if the resulting range would be split in two.
    @param {range} other - The range to merge.
    */
    union(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for union");
        }
        if (!this) { return other; }
        else if (!other) { return this; }
        var a, b;
        if (!this.startsAfter(other)) {
            a = this;
            b = other;
        }
        else {
            a = other;
            b = this;
        }

        if (a.upper <= b.lower && !a.adjacent(b)) {
            throw new Error("Ranges must be either adjacent or overlapping");
        }

        var upper, upperInc;
        if (a.upper == b.upper) {
            upper = a.upper;
            upperInc = a.upperInc || b.upperInc;
        }
        else if (a.upper < b.upper) {
            upper = b.upper;
            upperInc = b.upperInc;
        }
        else {
            upper = a.upper;
            upperInc = a.upperInc;
        }

        return new RangeClass({lower: a.lower, upper: upper, lowerInc: a.lowerInc, upperInc: upperInc});
    }
    /**
    @memberof RangeClass
    @method difference
    @description Compute the difference between this and a given range.
    *note: The difference can not be computed if the resulting range would be split in two seperate ranges.
    @param {range} other - The range to find the difference with.
    */
    difference(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for difference");
        }

        if (!this || !other || !this.overlap(other)) {
            return this;
        }
        else if (other.contains(this)) {
            return this.empty();
        }
        else if (this.contains(other) && !(this.startsWith(other) || this.endsWith(other))) {
            throw new Error("Other range must not be within this range");
        }
        else if (this.endsBefore(other)) {
            return this.replace({upper:other.lower, upperInc:!other.lowerInc});
        }
        else if (this.startsAfter(other)) {
            return this.replace({lower:other.upper, lowerInc:!other.upperInc});
        }
        else {
            return self.empty();
        }
    }
    /**
    @memberof RangeClass
    @method intersection
    @description Returns a new range containing all points shared by both ranges. If no points are shared an empty range is returned
    *note: The difference can not be computed if the resulting range would be split in two seperate ranges.
    @param {range} other - The range to intersect with.
    */
    intersection(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for intersection");
        }

        if (!this || !other || !this.overlap(other)) {
            return this.empty();
        }

        var lowerEndSpan = this.startsAfter(other) ? this : other;
        var upperEndSpan = this.endsBefore(other) ? this : other;

        return lowerEndSpan.replace({upper: upperEndSpan.upper, upperInc: upperEndSpan.upperInc});
    }
    /**
    @memberof RangeClass
    @method startsWith
    @description Test if this range starts with other. other may either be range or scalar.
    @param {variable} other - Range or scalar to test.
    */
    startsWith(other) {
        if (this.isValidRange(other)) {
            if (this.lowerInc === other.lowerInc) {
                return this.lower === other.lower;
            }
            else {
                return false;
            }
        }
        else if (this.isValidScalar(other)) {
            if (this.lowerInc) {
                return this.lower === other;
            }
            else {
                return false;
            }
        }
        else {
            throw new Error("Unsupported type to test for starts with");
        }
    }
    /**
    @memberof RangeClass
    @method endsWith
    @description Test if this range ends with other. other may either be range or scalar.
    @param {variable} other - Range or scalar to test.
    */
    endsWith(other) {
        if (this.isValidRange(other)) {
            if (this.upperInc === other.upperInc) {
                return this.upper === other.upper;
            }
            else {
                return false;
            }
        }
        else if (this.isValidScalar(other)) {
            if (this.upperInc) {
                return this.upper === other;
            }
            else {
                return false;
            }
        }
        else {
            throw new Error("Unsupported type to test for ends with");
        }
    }
    /**
    @memberof RangeClass
    @method startsAfter
    @description Test if this range starts after other. Other may be either a range or a scalar.
    @param {variable} other - Range or scalar to test.
    */
    startsAfter(other) {
        if (this.isValidRange(other)) {
            if (this.lower === other.lower) {
                return other.lowerInc || !this.lowerInc;
            }
            else if (this.lower === null) {
                return false;
            }
            else if (other.lower === null) {
                return true;
            }
            else {
                return this.lower > other.lower;
            }
        }
        else if (this.isValidScalar(other)) {
            return this.lower >= other;
        }
        else {
            throw new Error("Unsupported type to test for starts after");
        }
    }
    /**
    @memberof RangeClass
    @method endsBefore
    @description Test if this range ends before other. Other may be either a range or a scalar.
    @param {variable} other - Range or scalar to test.
    */
    endsBefore(other) {
        if (this.isValidRange(other)) {
            if (this.upper === other.upper) {
                return other.upperInc || !this.upperInc;
            }
            else if (!this.upper) {
                return false;
            }
            else if (!other.upper) {
                return true;
            }
            else {
                return this.upper <= other.upper;
            }
        }
        else if (this.isValidScalar(other)) {
            return this.upper <= other;
        }
        else {
            throw new Error("Unsupported type to test for ends before");
        }
    }
    /**
    @memberof RangeClass
    @method leftOf
    @description Test if the range is strictly left of `other`.
    @param {range} other - Range to test.
    */
    leftOf(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for left of");
        }
        return (this.endsBefore(other) && !this.overlap(other));
    }
    /**
    @memberof RangeClass
    @method rightOf
    @description Test if the range is strictly right of `other`.
    @param {range} other - Range to test.
    */
    rightOf(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for right of");
        }
        return other.leftOf(this);
    }
}

module.exports = RangeClass;
