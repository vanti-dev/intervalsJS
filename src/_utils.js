OffsetableRangeMixin =  {
    offsetType: null,
    offset: function(offset) {


        if (offset && !this.isValidScalar(offset)) {
            throw new Error("Invalid type for offset");
        }

        var lower = this.lower ? this.lower+offset : null;
        var upper = this.upper ? this.upper+offset : null;

        return this.replace({upper: upper, lower: lower});
    }
};

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

var getType = function(data) {
    if (typeof data === 'number') {
        if ((!isNaN(data) && data.toString().indexOf('.') != -1)) { return "float"; }
        else if (data%1 === 0) { return "int"; }
    }
    else { return "ustr"; }
};

module.exports = {
    OffsetableRangeMixin: OffsetableRangeMixin,
    namedList: namedList,
    getType: getType
};
