var utils = require("./_utils.js");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true])

class RangeClass {

    constructor(settings = {}) {
        if (settings.upper && settings.lower && settings.upper < settings.lower) {
            throw new Error("Upper bound is less than lower bound!")
        }
        var settings = {
            //Setting default values
            lower: settings.lower || null,
            upper: settings.upper || null,
            lowerInc: settings.lowerInc || true,
            upperInc: settings.upperInc || false
        }
        this._range = _internalRange([settings.lower, settings.upper, settings.lowerInc, settings.upperInc, false]);
    }

    empty() {
        this._range = _emptyInternalRange;
        return this;
    }

    replace(settings = {}) {
        if (settings.lower != undefined) {
            this._range.lower = settings.lower;
        }
        if (settings.upper != undefined) {
            this._range.upper = settings.upper;
        }
        if (settings.lowerInc != undefined) {
            this._range.lowerInc = settings.lowerInc;
        }
        if (settings.upperInc != undefined) {
            this._range.upperInc = settings.upperInc;
        }
        return this;
    }

    lower() {
        return (this._range.lower != null) ? this._range.lower : null;
    }

    upper() {
        return (this._range.upper != null) ? this._range.upper : null;
    }

    lowerInc() {
        return this._range.lowerInc || false;
    }

    upperInc() {
        return this._range.upperInc || false;
    }

    isValidRange(obj) {
        return obj instanceof RangeClass;
    }

    isValidScalar(scalar) {
        if (this.type === "int") {
            return scalar%1 === 0
        }
        return typeof scalar === typeof this.upper();
    }

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
            if (this.lower()) {
                isInLower = (this.lower() < other);
            }

            var isInUpper = true;
            if (this.upper()) {
                isInUpper = (this.upper() >= other);
            }

            return isInLower && isInUpper;
        }
        else {
            throw new Error("Unsupported type to test for inclusion");
        }
    }

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

        if (!a.upper() || !b.lower()) {
            return true;
        }
        return a.upper() > b.lower() || a.upper() === b.lower() && a.upperInc() && b.lowerInc();
    }

    adjacent(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for inclusion");
        }
        else if (!this || !other) {
            return false;
        }
        return (this.lower() == other.upper() && this.lowerInc() != other.upperInc())
            || (this.upper() == other.lower() && this.upperInc() != other.lowerInc())
    }

    union(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for union");
        }
        if (!this) { return other }
        else if (!other) { return this }
        var a, b;
        if (!this.startsAfter(other)) {
            a = this;
            b = other;
        }
        else {
            a = other;
            b = this;
        }

        if (a.upper() <= b.lower() && !a.adjacent(b)) {
            throw new Error("Ranges must be either adjacent or overlapping");
        }

        var upper, upperInc;
        if (a.upper() == b.upper()) {
            upper = a.upper();
            upperInc = a.upperInc() || b.upperInc();
        }
        else if (a.upper() < b.upper()) {
            upper = b.upper();
            upperInc = b.upperInc();
        }
        else {
            upper = a.upper();
            upperInc = a.upperInc();
        }

        return new RangeClass({lower: a.lower(), upper: upper, lowerInc: a.lowerInc(), upperInc: upperInc});
    }

    difference(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for difference");
        }

        if (!this || !other || !this.overlap(other)) {
            return this;
        }
        else if (other.contains(this)) {
            return this.empty()
        }
        else if (this.contains(other) && !(this.startsWith(other) || this.endsWith(other))) {
            throw new Error("Other range must not be within this range")
        }
        else if (this.endsBefore(other)) {
            return this.replace({upper:other.lower(), upperInc:!other.lowerInc()})
        }
        else if (this.startsAfter(other)) {
            return this.replace({lower:other.upper(), lowerInc:!other.upperInc()})
        }
        else {
            return self.empty();
        }
    }

    intersection(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for intersection");
        }

        if (!this || !other || !this.overlap(other)) {
            return this.empty();
        }

        var lowerEndSpan = this.startsAfter(other) ? this : other;
        var upperEndSpan = this.endsBefore(other) ? this : other;

        return lowerEndSpan.replace({upper: upperEndSpan.upper(), upperInc: upperEndSpan.upperInc()})
    }

    startsWith(other) {
        if (this.isValidRange(other)) {
            if (this.lowerInc() === other.lowerInc()) {
                return this.lower() === other.lower()
            }
            else {
                return false;
            }
        }
        else if (this.isValidScalar(other)) {
            if (this.lowerInc()) {
                return this.lower() === other
            }
            else {
                return false;
            }
        }
        else {
            throw new Error("Unsupported type to test for starts with");
        }
    }

    endsWith(other) {
        if (this.isValidRange(other)) {
            if (this.upperInc() === other.upperInc()) {
                return this.upper() === other.upper()
            }
            else {
                return false;
            }
        }
        else if (this.isValidScalar(other)) {
            if (this.upperInc()) {
                return this.upper() === other
            }
            else {
                return false;
            }
        }
        else {
            throw new Error("Unsupported type to test for ends with");
        }
    }
    startsAfter(other) {
        if (this.isValidRange(other)) {
            if (this.lower() === other.lower()) {
                return other.lowerInc() || !this.lowerInc();
            }
            else if (this.lower() == null) {
                return false;
            }
            else if (other.lower() == null) {
                return true;
            }
            else {
                return this.lower() > other.lower()
            }
        }
        else if (this.isValidScalar(other)) {
            return this.lower() >= other;
        }
        else {
            throw new Error("Unsupported type to test for starts after");
        }
    }

    endsBefore(other) {
        if (this.isValidRange(other)) {
            if (this.upper() === other.upper()) {
                return other.upperInc() || !this.upperInc();
            }
            else if (!this.upper()) {
                return false;
            }
            else if (!other.upper()) {
                return true;
            }
            else {
                return this.upper() <= other.upper();
            }
        }
        else if (this.isValidScalar(other)) {
            return this.upper() <= other;
        }
        else {
            throw new Error("Unsupported type to test for ends before");
        }
    }

    leftOf(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for left of");
        }
        return (this.endsBefore(other) && !this.overlap(other));
    }

    rightOf(other) {
        if (!this.isValidRange(other)) {
            throw new Error("Unsupported type to test for right of");
        }
        return other.leftOf(this);
    }
}

module.exports = RangeClass
