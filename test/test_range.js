var range = require("../src/spans.js");
var assert = require('chai').assert;

describe('ranges', function() {
    console.log(range)
    it('creates an empty range', function() {
        var intrange = new range.RangeClass();
        assert(typeof intrange === "object" && intrange != null, 'Object created');
        assert(intrange.lower === null);
        assert(intrange.upper === null);
    });
});
