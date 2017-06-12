var assert = require('chai').assert;
var range = require("../main.js");
var expect = require('chai').expect;
var moment = require('moment');

describe('periodRange', function() {
    it ('Tests period type', function() {
        var periodRange = new range.periodRange().fromDate("2000-01-01", "day");
        assert(periodRange.period == "day");

        periodRange = periodRange.fromDate("2000-01-01", "week");
        assert(periodRange.period == "week");

        periodRange = periodRange.fromDate("2000-01-01", "americanWeek");
        assert(periodRange.period == "americanWeek");

        periodRange = periodRange.fromDate("2000-01-01", "month");
        assert(periodRange.period == "month");

        periodRange = periodRange.fromDate("2000-01-01", "quarter");
        assert(periodRange.period == "quarter");

        periodRange = periodRange.fromDate("2000-01-01", "year");
        assert(periodRange.period == "year");
    });
});
