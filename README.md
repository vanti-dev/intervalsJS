# intervalsJS
[![Build Status](https://travis-ci.org/Tehmo3/Intervals-In-Node.svg?branch=master)](https://travis-ci.org/Tehmo3/Intervals-In-Node)
[![codecov](https://codecov.io/gh/Tehmo3/Intervals-In-Node/branch/master/graph/badge.svg)](https://codecov.io/gh/Tehmo3/Intervals-In-Node)

Spans is a Javascript library for working with intervals. This library can be
useful any time you find yourself working with intervals of numbers, strings or
even dates. [Documentation.](http://jaspermiles.me/intervalsJS/)

## Installation
To install intervalsJS into your npm project, run the command
```
npm install intervals-js --save
```
## A brief example
Imagine, you are building a calendar and you want to be able to display all
weeks that overlap with the current month. This is a trivial task when using
intervalsJS!

First, make sure you require intervalsJS
```
const intervalsJS = require('intervals-js');
```

Then, using a DateRange we can get a range representing January in the year 2000.
```
const month = new intervalsJS.DateRange().fromDate('2000-01-01', 'month');
```

Next, we can easily calculate the weeks which contain the first, and last day of
the month.

```
const startWeek = new intervalsJS.DateRange().fromDate(month.lower, 'week');
const endWeek = new intervalsJS.DateRange().fromDate(month.upper, 'week');
```

Then using the union method, we can find all the days to display on our calendar
```
const display = month.union(startWeek).union(endWeek);
```


Huge thanks to [Andreas Runfalk](https://github.com/runfalk) for not only inspiring me but also providing valuable feedback along the way. Heavy inspiration for how the implementation should run was taken from his python library [spans](https://github.com/runfalk/spans).
