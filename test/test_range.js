var range = require("../src/spans.js");
var assert = require('chai').assert;

describe('ranges', function() {
    var emptyIntrange = new range.RangeClass().empty();
    it('Creates empty intrange', function() {
        assert(typeof emptyIntrange === "object" && emptyIntrange != null, 'Object created');
        assert(emptyIntrange.lower === null);
        assert(emptyIntrange.upper === null);
    });
    it ('tests default bounds', function() {
        assert(!emptyIntrange.lowerInc);
        assert(!emptyIntrange.upperInc);
    });
});
