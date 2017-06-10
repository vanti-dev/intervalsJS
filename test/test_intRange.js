var assert = require('chai').assert;
var range = require("../main.js");
describe('intRange', function() {

    it('tests length', function() {
        var intrange = new range.intRange({lower:0, upper:5});

        assert(intrange.length() === 5);
    });

    it('tests offset', function() {
        var intrange = new range.intRange({lower: 5, upper: 10});

        intrange.offset(-5);
        assert(intrange.upper() === 5);
        assert(intrange.lower() === 0);
    });
});
