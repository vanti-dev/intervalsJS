OffsetableRangeMixin =  {
    offsetType: null,
    offset: function(offset) {
        if (!this) {
            return this;
        }


        if (offset && !this.isValidScalar(offset)) {
            throw new Error("Invalid type for offset");
        }

        var lower = (this.lower()) ? this.lower()+offset : null;
        var upper = (this.upper()) ? this.upper()+offset : null;

        return this.replace({upper: upper, lower: lower});
    }
}

var namedList = function(fields) {
    //Emulating pythons Named Tuples
    return function(arr) {
        var obj = { };

        for(var i = 0; i < arr.length; i++) {
            obj[fields[i]] = arr[i];
        }

        return obj;
    };
};

module.exports = {
    OffsetableRangeMixin: OffsetableRangeMixin,
    namedList: namedList
}
