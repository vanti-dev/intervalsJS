const discreteRange = require('./src/DiscreteRanges.js');
const contRange = require('./src/ContinuousRanges.js');
const MomentDateRange = require('./src/MomentDateRanges.js');

module.exports = {};

module.exports.IntRange = discreteRange.IntRange;
module.exports.DateRange = MomentDateRange.DateRange;
module.exports.StrRange = discreteRange.StrRange;
module.exports.PeriodRange = MomentDateRange.PeriodRange;
module.exports.floatRange = contRange.floatRange;
module.exports.DateTimeRange = MomentDateRange.DateTimeRange;
module.exports.timedeltaRange = contRange.timedeltaRange;
