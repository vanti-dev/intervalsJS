class RangeClass {

    constructor(lower, upper, lowerInc, upperInc) {
        this.lower = lower || null;
        this.upper = upper || null;
        this.lowerInc = lowerInc || null;
        this.upperInc = upperInc || null;
    }
}

module.exports = {
    RangeClass: RangeClass
}
