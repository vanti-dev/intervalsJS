var RangeClass = require("./Range.js");
var utils = require("./_utils");

var _internalRange = utils.namedList(["lower","upper","lowerInc","upperInc", "empty"]);
var _emptyInternalRange = _internalRange([null, null, false, false, true])

class DiscreteRange extends RangeClass {
    constructor(settings = {}, step) {
        super(settings);
        this.step = step;
        var lb = this.lower();
        if (this.lower() && !this.lowerInc()) {
            lb = this.next(lb);
        }

        var ub = this.upper();
        if (this.upper() && this.upperInc()) {
            ub = this.next(ub);
        }
        if (this.lower() && this.upper() && lb >= ub) {
            this._range = _emptyInternalRange;
        }
        else {
            this._range = _internalRange([lb, ub, true, false, false]);
        }
    }

    next(curr) {
        return curr + this.step;
    }

    prev(curr) {
        return curr - this.step;
    }

    last() {
        if (!this || !this.upper()) {
            return null;
        }
        else {
            return this.prev(this.upper())
        }
    }

    endsWith(other) {
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
        super(settings, 1);
        Object.assign(this, utils.OffsetableRangeMixin);
        this.type = "int";
    }

    length() {
        return this.upper() - this.lower();
    }
}

class strRange extends DiscreteRange {
    constructor(settings={}) {
        super(settings, 1);
        this.type = "ustr";
    }
    next(curr) {
        if (!curr) {
            return "";
        }
        var last = curr.substr(curr.length - 1);

        if (last.charCodeAt() === 65535) {
                return this.next(curr.slice(0,-1)) + String.fromCharCode(0)
        }
        else {
            return curr.slice(0,-1) + String.fromCharCode(last.charCodeAt()+1)
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
            return curr.slice(0,-1) + String.fromCharCode(last.charCodeAt()-1)
        }
    }
}

class dateRange extends DiscreteRange {
    constructor(settings = {}) {
        super(settings, 1)
        this.type = "date";
        //Work from here
    }
}

class PeriodRange extends dateRange {
    constructor(settings = {}) {
        super(settings, 1);
        //Work from here
    }
}

module.exports = {
    intRange: intRange,
    strRange: strRange,
    dateRange: dateRange,
    PeriodRange: PeriodRange
}
