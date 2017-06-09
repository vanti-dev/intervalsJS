var range = require("../src/spans.js");
var assert = require('chai').assert;

describe('Ranges', function() {
    it('Creates empty intrange', function() {
        var emptyIntrange = new range().empty();
        assert(typeof emptyIntrange === "object" && emptyIntrange != null, 'Object created');
        assert(emptyIntrange.lower() === null);
        assert(emptyIntrange.upper() === null);
    });
    it ('tests default bounds', function() {
        var emptyIntrange = new range().empty();
        assert(!emptyIntrange.lowerInc());
        assert(!emptyIntrange.upperInc());
    });

    it ('tests bounds intrage', function() {
        var intrange = new range({lower:1, upper:2});
        assert(intrange.lower() == 1);
        assert(intrange.upper() == 2);
    });
    it ('tests replace range', function () {
        var intrange = new range({lower:1, upper:2});
        intrange.replace({lower:3, upper:10});
        assert(intrange.lower() == 3);
        assert(intrange.upper() == 10);
        assert(!intrange.lowerInc());
    });
    it ('tests replace includes', function () {
        var intrange = new range({lower:1, upper:2});
        intrange.replace({lowerInc:true, upperInc:true});
        assert(intrange.upperInc());
        assert(intrange.lowerInc());
    });

    it ('tests if the ranges are valid', function () {
        var emptyIntrange = new range().empty();
        var intrange = new range({lower:1, upper:2});
        assert(emptyIntrange.isValidRange(emptyIntrange));
        assert(intrange.isValidRange(intrange));
    })

    it ('tests if intrange startsAfter', function () {
        var intrange = new range({lower:1, upper:2});
        var startsAfterRange = new range({lower: -2, upper: 10});
        var intrangeUnbounded = new range().empty();
        assert(intrange.startsAfter(startsAfterRange));
        assert(intrange.startsAfter(0));
        assert(!intrange.startsAfter(2));
        assert(intrange.startsAfter(intrangeUnbounded));
    })
    it ('tests if intrange endsBefore', function () {
        var intrange = new range({lower:1, upper:2});
        var endsBeforeRange = new range({lower: 1, upper: 10});
        var intrangeUnbounded = new range().empty();
        assert(intrange.endsBefore(endsBeforeRange));
        assert(intrange.endsBefore(2));
        assert(!intrange.endsBefore(-10));
        assert(intrange.endsBefore(intrangeUnbounded));
    })
    it ('tests if intrange contains', function () {
        var intrange = new range({lower:1, upper:10});
        var contain = new range({lower: 1, upper: 10});
        assert(intrange.contains(contain));
        contain.replace({lower:3, upper:12});
        assert(!intrange.contains(contain));
        contain.replace({lower:-2, upper:9});
        assert(!intrange.contains(contain));
        var intrangeUnbounded = new range().empty();
        assert(intrange.contains(5));
        assert(!intrange.contains(-3));
        assert(!intrange.contains(intrangeUnbounded));
    })

    it ('tets if intrange overlaps', function() {
        var intrange = new range({lower:1, upper:10, upperInc: true});
        var overlaps = new range({lower: 10, upper: 80, lowerInc: true});
        assert(intrange.overlap(overlaps));
        overlaps.replace({lower:-2, upper:5});
        assert(intrange.overlap(overlaps));
        overlaps.replace({lower:12, upper:16});
        assert(!intrange.overlap(overlaps));
        var intrangeUnbounded = new range().empty();
        assert(intrange.overlap(intrangeUnbounded));
    })

    it ('tests if intranges are adjacent', function() {
        var intrange = new range({lower:1, upper:10});
        var adjacent = new range({lower: 10, upper: 80, lowerInc: true});
        assert(intrange.adjacent(adjacent));
        adjacent.replace({lower: 120, upper: 2000});
        assert(!intrange.adjacent(adjacent));
    })

    it ('tests intrange union', function() {
        var intrange = new range({lower:1, upper:10});
        var intrange2 = new range({lower: 2, upper: 12});
        var union = intrange.union(intrange2);
        assert(union.upper() === 12);
        assert(union.lower() ==1);
    })

    it ('tests startsWith', function() {
        var intrange = new range({lower:1, upper:10, lowerInc: true});
        var startswithRange = new range({lower: 1, upper: 5, lowerInc: true});
        assert(intrange.startsWith(startswithRange));
        assert(intrange.startsWith(1));
        startswithRange.replace({lowerInc: false});
        assert(!intrange.startsWith(startswithRange));
    })
    it ('tests startsWith', function() {
        var intrange = new range({lower:1, upper:10, upperInc: true});
        var endswithRange = new range({lower: 5, upper: 10, upperInc: true});
        assert(intrange.endsWith(endswithRange));
        assert(intrange.endsWith(10));
        endswithRange.replace({upperInc: false});
        assert(!intrange.endsWith(endswithRange));
    })
    it ('tests difference', function() {
        var intrange = new range({lower:1, upper:10, upperInc: true, lowerInc: true});
        var intrange2 = new range({lower: 10, upper: 15, lowerInc: true});
        var difference = intrange.difference(intrange2);
        assert(difference.lower() === 1);
        assert(difference.upper() == 10);

        intrange.replace({upper: 5});
        intrange2.replace({lower: 1});
        difference = intrange.difference(intrange2);
        assert(difference._range.empty);
    })
});
