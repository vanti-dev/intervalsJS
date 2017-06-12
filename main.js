const discreteRange = require('./src/DiscreteRanges.js');
const contRange = require('./src/ContinuousRanges.js');

module.exports = {};

module.exports.IntRange = discreteRange.IntRange;
module.exports.DateRange = discreteRange.DateRange;
module.exports.StrRange = discreteRange.StrRange;
module.exports.PeriodRange = discreteRange.PeriodRange;
module.exports.floatRange = contRange.floatRange;
module.exports.datetimeRange = contRange.datetimeRange;
module.exports.timedeltaRange = contRange.timedeltaRange;
