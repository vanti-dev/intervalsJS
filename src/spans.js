var namedList = function(fields) {
    //Emulating pythons Named Tuples
    return function(arr) {
        var obj = { };

        for(var i = 0; i < arr.length; i++) {
            obj[fields[i]] = arr[i];
        }

        return obj;
    };
};

var _internalRange = namedList(["lower","upper","lowerInc","upperInc", "empty"]);
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
            lowerInc: settings.lowerInc || false,
            upperInc: settings.upperInc || false
        }
        this._range = _internalRange([settings.lower, settings.upper, settings.lowerInc, settings.upperInc, false]);
    }

    empty() {
        this._range = _emptyInternalRange;
        return this;
    }

    replace(settings = {}) {
        this._range.lower = settings.lower || this._range.lower;
        this._range.upper = settings.upper || this._range.upper;
        this._range.lowerInc = settings.lowerInc || this._range.lowerInc;
        this._range.upperInc = settings.upperInc || this._range.upperInc;
        return this;
    }

    lower() {
        return this._range.lower || null;
    }

    upper() {
        return this._range.upper || null;
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
        return typeof scalar === 'number';
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
}

module.exports = {
    RangeClass: RangeClass
}
