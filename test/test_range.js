var range = require("../src/spans.js");
var assert = require('chai').assert;

describe('Ranges', function() {
    it('Creates empty intrange', function() {
        var emptyIntrange = new range.RangeClass().empty();
        assert(typeof emptyIntrange === "object" && emptyIntrange != null, 'Object created');
        assert(emptyIntrange.lower() === null);
        assert(emptyIntrange.upper() === null);
    });
    it ('tests default bounds', function() {
        var emptyIntrange = new range.RangeClass().empty();
        assert(!emptyIntrange.lowerInc());
        assert(!emptyIntrange.upperInc());
    });

    it ('tests bounds intrage', function() {
        var intrange = new range.RangeClass({lower:1, upper:2});
        assert(intrange.lower() == 1);
        assert(intrange.upper() == 2);
    });
    it ('tests replace range', function () {
        var intrange = new range.RangeClass({lower:1, upper:2});
        intrange.replace({lower:3, upper:10});
        assert(intrange.lower() == 3);
        assert(intrange.upper() == 10);
        assert(!intrange.lowerInc());
    });
    it ('tests replace includes', function () {
        var intrange = new range.RangeClass({lower:1, upper:2});
        intrange.replace({lowerInc:true, upperInc:true});
        assert(intrange.upperInc());
        assert(intrange.lowerInc());
    });

    it ('tests if the ranges are valid', function () {
        var emptyIntrange = new range.RangeClass().empty();
        var intrange = new range.RangeClass({lower:1, upper:2});
        assert(emptyIntrange.isValidRange(emptyIntrange));
        assert(intrange.isValidRange(intrange));
    })

    it ('tests if intrange startsAfter', function () {
        var intrange = new range.RangeClass({lower:1, upper:2});
        var startsAfterRange = new range.RangeClass({lower: -2, upper: 10});
        var intrangeUnbounded = new range.RangeClass().empty();
        assert(intrange.startsAfter(startsAfterRange));
        assert(intrange.startsAfter(0));
        assert(!intrange.startsAfter(2));
        assert(intrange.startsAfter(intrangeUnbounded));
    })
    it ('tests if intrange endsBefore', function () {
        var intrange = new range.RangeClass({lower:1, upper:2});
        var endsBeforeRange = new range.RangeClass({lower: 1, upper: 10});
        var intrangeUnbounded = new range.RangeClass().empty();
        assert(intrange.endsBefore(endsBeforeRange));
        assert(intrange.endsBefore(2));
        assert(!intrange.endsBefore(-10));
        assert(intrange.endsBefore(intrangeUnbounded));
    })
});
