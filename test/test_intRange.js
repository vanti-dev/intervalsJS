var assert = require('chai').assert;
var range = require("../src/DiscreteRanges.js");
describe('intRange', function() {
    it ('tests length', function() {
        var intrange = new range.intRange({lower:0, upper:5});
        assert(intrange.length() === 5);
    });
});
