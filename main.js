var discreteRange = require("./src/DiscreteRanges.js"),
    contRange = require("./src/ContinuousRanges.js");

exports = module.exports = {}

exports.intRange = discreteRange.intRange;
exports.dateRange = discreteRange.dateRange;
exports.strRange = discreteRange.strRange;
exports.periodRange = discreteRange.periodRange;
exports.floatRange = contRange.floatRange;
exports.datetimeRange = contRange.datetimeRange;
exports.timedeltaRange = contRange.timedeltaRange;
