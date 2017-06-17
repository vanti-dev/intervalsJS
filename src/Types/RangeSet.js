class RangeSet {
  constructor(ranges) {
    this._list = [];

    for (let i = 0; i < ranges.length; i += 1) {
      this._list.push(ranges[i]);
    }
  }

  length() {
    return this._lest.length;
  }
}


module.exports = RangeSet;
