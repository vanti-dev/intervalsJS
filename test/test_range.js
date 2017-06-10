var range = require("../main.js");
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Basic Range Functionality', function() {

    it('Creates empty range', function() {
        var emptyIntrange = new range.intRange().empty();

        assert(typeof emptyIntrange === "object" && emptyIntrange !== null, 'Object created');
        assert(emptyIntrange.isEmpty());
    });

    it('Tests default bounds', function() {
        var emptyIntrange = new range.intRange().empty();

        assert(!emptyIntrange.lowerInc);
        assert(!emptyIntrange.upperInc);
    });

    it('Tests bounds', function() {
        var intrange = new range.intRange({lower:1, upper:3});

        assert(intrange.lower == 1);
        assert(intrange.upper == 3);

        expect(() => intrange = new range.intRange({lower:'a', upper: 2})).to.throw(Error);
        expect(() => intrange = new range.intRange({lower:3, upper: 'b'})).to.throw(Error);
    });

    it('Tests replace', function () {
        var intrange = new range.intRange({lower:1, upper:2});
        intrange.replace({lower:3, upper:10});
        assert(intrange.lower == 3);
        assert(intrange.upper == 10);
        assert(intrange.lowerInc);

        intrange.replace({lowerInc:true, upperInc:true});
        assert(intrange.upperInc);
        assert(intrange.lowerInc);
    });

    it('tests equality', function() {
        var intrange = new range.intRange({lower: 10, upper:24});
        var intrange2 = new range.intRange({lower: 10, upper: 24});

        assert(intrange.isEqual(intrange2));

        intrange2.replace({lower: -8});
        assert(!intrange.isEqual(intrange2));

        intrange.replace({lower: -8, upperInc: true});
        assert(!intrange.isEqual(intrange2));
    });

    it('tests if the ranges are valid', function () {
        var emptyIntrange = new range.intRange().empty();
        var intrange = new range.intRange({lower:1, upper:2});

        assert(emptyIntrange.isValidRange(emptyIntrange));
        assert(intrange.isValidRange(intrange));
    });

    it('tests startsAfter', function () {
        var intrange = new range.intRange({lower:1, upper:5});
        var startsAfterRange = new range.intRange({lower: -2, upper: 10});
        var intrangeUnbounded = new range.intRange().empty();

        assert(intrange.startsAfter(startsAfterRange));
        assert(intrange.startsAfter(0));
        assert(!intrange.startsAfter(3));
        assert(intrange.startsAfter(intrangeUnbounded));

        expect(() => intrange.startsAfter('a')).to.throw(Error);
    });

    it('tests endsBefore', function () {
        var intrange = new range.intRange({lower:1, upper:3});
        var endsBeforeRange = new range.intRange({lower: 1, upper: 10});
        var intrangeNoUB = new range.intRange({lower: 5});
        var intrangeUnbounded = new range.intRange().empty();

        assert(intrange.endsBefore(endsBeforeRange));
        assert(intrange.endsBefore(5));
        assert(!intrange.endsBefore(-10));
        assert(intrange.endsBefore(intrangeUnbounded));
        assert(!intrangeNoUB.endsBefore(endsBeforeRange));
        expect(() => intrange.endsBefore('a')).to.throw(Error);
    });

    it('tests contains', function () {
        var intrange = new range.intRange({lower:1, upper:10});
        var contain = new range.intRange({lower: 1, upper: 10});

        assert(intrange.contains(contain));

        contain.replace({lower:3, upper:12});
        assert(!intrange.contains(contain));

        contain.replace({lower:-2, upper:9});
        assert(!intrange.contains(contain));

        var intrangeUnbounded = new range.intRange().empty();
        assert(intrange.contains(5));
        assert(!intrange.contains(-3));
        assert(!intrange.contains(intrangeUnbounded));

        expect(() => intrange.contains('a')).to.throw(Error);
    });


    it('tets overlaps', function() {
        var intrange = new range.intRange({lower:1, upper:10, upperInc: true});
        var overlaps = new range.intRange({lower: 10, upper: 80, lowerInc: true});

        assert(intrange.overlap(overlaps));

        overlaps.replace({lower:-2, upper:5});
        assert(intrange.overlap(overlaps));

        overlaps.replace({lower:12, upper:16});
        assert(!intrange.overlap(overlaps));

        var intrangeUnbounded = new range.intRange().empty();
        assert(intrange.overlap(intrangeUnbounded));
    });


    it('tests adjacent', function() {
        var intrange = new range.intRange({lower:1, upper:10});
        var adjacent = new range.intRange({lower: 10, upper: 80, lowerInc: true});

        assert(intrange.adjacent(adjacent));
        adjacent.replace({lower: 120, upper: 2000});
        assert(!intrange.adjacent(adjacent));

        expect(() => intrange.adjacent(1)).to.throw(Error);
    });


    it('tests union', function() {
        var intrange = new range.intRange({lower:1, upper:10});
        var intrange2 = new range.intRange({lower: 2, upper: 12});


        assert(intrange.union(intrange2).upper === 12);
        assert(intrange.union(intrange2).lower === 1);

        expect(() => intrange.union(1)).to.throw(Error);
    });


    it('tests startsWith', function() {
        var intrange = new range.intRange({lower:1, upper:10, lowerInc: true});
        var startswithRange = new range.intRange({lower: 1, upper: 5, lowerInc: true});

        assert(intrange.startsWith(startswithRange));
        assert(intrange.startsWith(1));

        startswithRange.replace({lowerInc: false});
        assert(!intrange.startsWith(startswithRange));

        expect(() => intrange.adjacent('a')).to.throw(Error);
    });

    it('tests endsWith', function() {
        var intrange = new range.intRange({lower:1, upper:10, upperInc: true});
        var endswithRange = new range.intRange({lower: 5, upper: 10, upperInc: true});
        assert(intrange.endsWith(endswithRange));
        assert(intrange.endsWith(10));
        assert(!intrange.endsWith(3));

        endswithRange.replace({upper: 9});
        assert(!intrange.endsWith(endswithRange));


        expect(() => intrange.endsWith('a')).to.throw(Error);
    });

    it('tests difference', function() {
        var intrange = new range.intRange({lower:1, upper:10, upperInc: true, lowerInc: true});
        var intrange2 = new range.intRange({lower: 8, upper: 15, lowerInc: true});
        intrange.difference(intrange2);

        assert(intrange.lower === 1);
        assert(intrange.upper == 8);

        intrange.replace({upper: 5});
        intrange2.replace({lower: 1});
        assert(intrange.difference(intrange2).isEmpty());

        expect(() => intrange.difference(1)).to.throw(Error);
    });


    it('tests intersection', function() {
        var intrange = new range.intRange({lower: 3, upper: 5, lowerInc: true, upperInc: false});
        var intrange2 = new range.intRange({lower: 1, upper: 10});
        intrange.intersection(intrange2);

        assert(intrange.lower === 3);
        assert(intrange.upper === 5);

        intrange2.replace({lower: 50, upper: 100});
        assert(intrange.intersection(intrange2).isEmpty());


        expect(() => intrange.intersection(1)).to.throw(Error);
    });


    it('tests left of', function() {
        var intrange = new range.intRange({lower: 1, upper: 5});
        var intrange2 = new range.intRange({lower: 5, upper: 10});

        assert(intrange.leftOf(intrange2));

        intrange2.replace({lower: 3});
        assert(!intrange.leftOf(intrange2));

        expect(() => intrange.leftOf(1)).to.throw(Error);
    });


    it('tests right of', function() {
        var intrange = new range.intRange({lower: 5, upper: 10});
        var intrange2 = new range.intRange({lower: 1, upper: 5});

        assert(intrange.rightOf(intrange2));
        intrange.replace({lower: 1});

        assert(!intrange.rightOf(intrange2));

        expect(() => intrange.rightOf(1)).to.throw(Error);

    });

});
