var exports = module.exports = {};

var RangeC = (function () {
    "use strict";
    var priv = new WeakMap();
    var _ = function (instance) { return priv.get(instance);};

    class RangeCClass {
        constructor() {
            var privateMembers = {};

        }
    }
    return RangeCClass;
} () );

exports.range = RangeC;
