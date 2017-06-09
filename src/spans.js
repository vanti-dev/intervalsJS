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

    constructor(lower=null, upper=null, lowerInc=false, upperInc=false) {
        this.lower = lower;
        this.upper = upper;
        this.lowerInc = lowerInc;
        this.upperInc = upperInc;
        this._range = _internalRange([lower, upper, lowerInc, upperInc, false]);
    }

    empty() {
        this._range = _emptyInternalRange;
        return this;
    }

}

module.exports = {
    RangeClass: RangeClass
}
