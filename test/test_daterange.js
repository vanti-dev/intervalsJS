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

        expect(() => new range.dateRange({lower: 1})).to.throw(Error);
        expect(() => new range.dateRange({upper: 5})).to.throw(Error);
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

    it("Tests from date (week)", function() {
        var date = "2000-01-01";
        var dateRange = new range.dateRange().fromDate("2000-01-01", "week");
        var dateRangeComp = new range.dateRange({lower: "1999-12-27", upper:"2000-01-03"});

        assert(dateRange.isEqual(dateRangeComp));

        expect(() => dateRange.fromDate("2000-01-01", "zeeblezorp")).to.throw(Error);

        dateRange = dateRange.fromDate("2000-01-02", "week");
        assert(dateRange.isEqual(dateRangeComp));

        dateRange = dateRange.fromDate("2000-01-03", "week");
        dateRangeComp.replace({lower: "2000-01-02", upper: "2000-01-09"});

        assert(dateRange.isEqual(dateRangeComp));
    });

    it("Tests from date (American week)", function() {
        var dateRange = new range.dateRange().fromDate("2000-01-01", "americanWeek");
        var dateRangeComp = new range.dateRange({lower: "1999-12-26", upper:"2000-01-02"});

        assert(dateRange.isEqual(dateRangeComp));

        dateRange = dateRange.fromDate("2000-01-02", "americanWeek");
        dateRangeComp.replace({lower: "2000-01-02", upper: "2000-01-09"});
        assert(dateRange.isEqual(dateRangeComp));

        dateRange = dateRange.fromDate("2000-01-03", "americanWeek");

        assert(dateRange.isEqual(dateRangeComp));
    });

    it("Tests from date (month)", function() {
        var dateRange = new range.dateRange().fromDate("2000-01-01", "month");
        var dateRangeComp = new range.dateRange({lower: "2000-01-01", upper:"2000-01-31", upperInc: true});

        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2000-02-15", "month");
        dateRangeComp = new range.dateRange({lower: "2000-02-1", upper: "2000-02-29", upperInc: true});

        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2001-02-15", "month");
        dateRangeComp = new range.dateRange({lower: "2001-02-1", upper: "2001-02-28", upperInc: true});

        assert(dateRange.isEqual(dateRangeComp));

    });

    it("Tests from date (quarter)", function() {
        var dateRange = new range.dateRange().fromDate("2000-01-01", "quarter");
        var dateRangeComp = new range.dateRange({lower: "2000-01-01", upper:"2000-03-31", upperInc: true});

        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2000-02-15", "quarter");
        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2000-03-31", "quarter");
        assert(dateRange.isEqual(dateRangeComp));
    });

    it("Tests from date (year)", function() {
        var dateRange = new range.dateRange().fromDate("2000-01-01", "year");
        var dateRangeComp = new range.dateRange({lower: "2000-01-01", upper:"2001-01-01"});

        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2000-06-12", "year");
        assert(dateRange.isEqual(dateRangeComp));

        dateRange = new range.dateRange().fromDate("2000-12-31", "year");
        assert(dateRange.isEqual(dateRangeComp));
    });

    it("Tests period type check", function () {
        expect(() => new range.dateRange().fromDate("2000-01-01", "YEAR").to.throw(Error));
        expect(() => new range.dateRange().fromDate("2000-01-01", "Year").to.throw(Error));
        expect(() => new range.dateRange().fromDate("2000-01-01", "foobar").to.throw(Error));
    });

    it("Tests date type check", function () {
        expect(() => new range.dateRange().fromDate(true, "year").to.throw(Error));
        expect(() => new range.dateRange().fromDate("foobar", "year").to.throw(Error));
        expect(() => new range.dateRange().fromDate(1, "year").to.throw(Error));
    });

    it("Tests length", function() {
        var dateRange = new range.dateRange({lower: "2000-01-01", upper:"2000-02-01"});
        assert(dateRange.length() === 31);

        dateRange = new range.dateRange({lower: "2000-3-18", upper:"2000-04-5"});

        expect(() => new range.dateRange({lower: "2000-3-18"}).length().to.throw(Error));
    });

    it("Tests iteration", function() {
        var dateRange = new range.dateRange({lower: "2000-01-01", upper: "2000-01-28"});
        var current = dateRange.lower;
        for (let x of dateRange) {
            assert(current === x);
            current = dateRange.next(current);
        }
    });
});
