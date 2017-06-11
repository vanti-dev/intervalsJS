var assert = require('chai').assert;
var range = require("../main.js");
var expect = require('chai').expect;

describe('intRange', function() {

    it('tests length', function() {
        var intrange = new range.intRange({lower:0, upper:5});

        assert(intrange.length() === 5);
    });

    it('tests offset', function() {
        var intrange = new range.intRange({lower: 5, upper: 10});
        var notARange = null;

        intrange.offset(-5);
        assert(intrange.upper === 5);
        assert(intrange.lower === 0);

        expect(() => intrange.offset('a')).to.throw(Error);
    });


    it('tests iteration', function() {
        var intrange = new range.intRange({lower: 5, upper: 10});
        var i=5;
        for (let x  of intrange) {
            assert(x === i && i < intrange.upper);
            i++;
        }
    });
});
