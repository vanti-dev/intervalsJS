const discreteRange = require('./src/DiscreteRanges.js');
const contRange = require('./src/ContinuousRanges.js');
const MomentDateRange = require('./src/MomentDateRanges.js');
const RangeSets = require('./src/RangeSets.js');

module.exports = {};

module.exports.IntRange = discreteRange.IntRange;
module.exports.DateRange = MomentDateRange.DateRange;
module.exports.StrRange = discreteRange.StrRange;
module.exports.PeriodRange = MomentDateRange.PeriodRange;
module.exports.FloatRange = contRange.FloatRange;
module.exports.DateTimeRange = MomentDateRange.DateTimeRange;
module.exports.timedeltaRange = contRange.timedeltaRange;
module.exports.IntRangeSet = RangeSets.IntRangeSet;
module.exports.StrRangeSet = RangeSets.StrRangeSet;
module.exports.FloatRangeSet = RangeSets.FloatRangeSet;
module.exports.DateTimeRangeSet = RangeSets.DateTimeRangeSet;
module.exports.DateRangeSet = RangeSets.DateRangeSet;
module.exports.PeriodRangeSet = RangeSets.PeriodRangeSet;
