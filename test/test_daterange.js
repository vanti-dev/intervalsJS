var assert = require('chai').assert;
var range = require("../main.js");
var expect = require('chai').expect;
var moment = require('moment');

describe('dateRange', function() {
    it("Tests creation, typecheck and equality", function() {
        var dateRange = new range.dateRange({lower:"2017-06-11", upper:"2017-06-15"});
        var equaldateRange = new range.dateRange({lower:"2017-06-11", upper:"2017-06-15"});

        assert(dateRange);
        assert(dateRange.isEqual(equaldateRange));
        expect(() => new range.dateRange({lower: 12, upper :5})).to.throw(Error);
    });

    it("Tests offset", function() {
        var rangeLow = new range.dateRange({lower: "2000-01-01", upper:"2000-01-06"});
        var rangeHigh = new range.dateRange({lower: "2000-01-05", upper:"2000-01-10"});

        assert(!rangeLow.isEqual(rangeHigh));
        assert(rangeLow.offset(moment.duration(4, 'days')).isEqual(rangeHigh));
    });

    it("Tests from date (day)", function() {
        var dateRange = new range.dateRange().fromDate("2000-01-01");
        var seconddateRange = new range.dateRange({lower: "2000-01-01", upper: "2000-01-02"});

        assert(dateRange.isEqual(seconddateRange));
    });

    it("Tests iteration", function() {
        var dateRange = new range.dateRange({lower: "2000-01-01", upper: "2000-01-28"});

        for (let x of dateRange) {
            console.log(x);
        }
    });
});
