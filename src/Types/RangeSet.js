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

  isValidRangeset(obj) {
    return obj instanceof this.constructor;
  }

  isValidRange(obj) {
    return this.type.isValidRange(obj);
  }

  isValidScalar(obj) {
    return this.type.isValidScalar(obj);
  }

  copy() {
    return new this.constructor(this._list);
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
    while (i < this._list.length) {
      const r = this._list[i];

      if (r.overlap(item) || r.adjacent(item)) {
        buffer.push(this._list.splice(i, 1)[0]);
      } else if (item.leftOf(r)) {
        if (buffer.length === 0) {
          this._list.splice(i, 0, item);
        }
        break;
      }
      i += 1;
    }
    if (buffer.length === 0) {
      this._list.push(item);
    } else {
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
}


module.exports = RangeSet;
