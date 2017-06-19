class RangeSet {
  constructor(settings) {
    this.Type = settings.type;
    this._list = [];

    let i;
    for (i = 0; i < settings.ranges.length; i += 1) {
      this.add(settings.ranges[i]);
    }
  }

  get type() {
    return new this.Type();
  }

  _testRangeSetType(item) {
    if (!this.isValidRangeSet(item)) {
      throw new Error('Invalid range type');
    }
  }

  isValidRangeSet(obj) {
    return obj instanceof this.constructor;
  }

  _testRangeType(item) {
    if (!this.isValidRange(item)) {
      throw new Error('Invalid Range type');
    }
  }

  isValidRange(obj) {
    return this.type.isValidRange(obj);
  }

  isValidScalar(obj) {
    return this.type.isValidScalar(obj);
  }

  copy() {
    const newList = this._list.slice();
    return new this.constructor(newList);
  }

  contains(item) {
    if (!this.isValidRange(item) && !this.isValidScalar(item)) {
      throw new Error('Unsupported item type provided');
    }

    if (item === null || item === undefined) {
      return true;
    }
    let i;
    for (i = 0; i < this._list.length; i += 1) {
      if (this._list[i].contains(item)) {
        return true;
      }
    }
    return false;
  }

  remove(item) {
    let i = 0;
    while (i < this._list.length) {
      const r = this._list[i];
      if (item.leftOf(r)) {
        break;
      } else if (item.overlap(r)) {
        try {
          this._list[i] = r.difference(item);

          if (this._list[i].isEmpty) {
            this._list.splice(i, 1);
          }
        } catch (e) {
          this._list.splice(i, 1);
          this._list.splice(i, 0, r.replace({ lower: item.upper, lowerInc: !item.upperInc }));
          this._list.splice(i, 0, r.replace({ upper: item.lower, upperInc: !item.lowerInc }));
          break;
        }
      }
      i += 1;
    }
  }

  add(item) {
    let i = 0;
    const buffer = [];
    let boolean = true;

    this._testRangeType(item);

    if (item.isEmpty) {
      return;
    }
    while (i < this._list.length) {
      const r = this._list[i];

      if (r.overlap(item) || r.adjacent(item)) {
        buffer.push(this._list.splice(i, 1)[0]);
      } else if (item.leftOf(r)) {
        if (buffer.length === 0) {
          this._list.splice(i, 0, item);
        }
        boolean = false;
        break;
      }
      i += 1;
    }
    if (boolean) {
      if (buffer.length === 0) {
        this._list.push(item);
      }
    }
    if (buffer.length !== 0) {
      let j = 0;
      for (j = 0; j < buffer.length; j += 1) {
        item = item.union(buffer[j]);
      }
      this.add(item);
    }
  }

  span() {
    return this._list[0].replace({
      upper: this._list[this._list.length - 1].upper,
      upperInc: this._list[this._list.length - 1].upperInc,
    });
  }

  union(others) {
    const union = this.copy();
    let i = 0;
    for (i = 0; i < others.length; i += 1) {
      this._testRangeSetType(others[i]);
      union.add(others[i]);
    }
    return union;
  }

  difference(others) {
    const difference = this.copy();
    let i = 0;
    for (i = 0; i < others.length; i += 1) {
      this._testRangeSetType(others[i]);
      difference.remove(others[i]);
    }
    return difference;
  }

  intersection(others) {
    if (!Array.isArray(others)) {
      others = [others];
    }
    let intersection;
    let output = this.copy();
    let i;
    let j;
    let k;
    for (i = 0; i < others.length; i += 1) {
      this._testRangeSetType(others[i]);
      intersection = new this.constructor([]);

      for (j = 0; j < output._list.length; j += 1) {
        for (k = 0; k < others[i]._list.length; k += 1) {
          intersection.add(output._list[j].intersection(others[i]._list[k]));
        }
      }

      if (intersection.isEmpty) {
        return intersection;
      }

      output = intersection;
    }
    return output;
  }
}


module.exports = RangeSet;
