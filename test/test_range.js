var range = require("../range.js");

describe('intrange', function() {
    it('creates an empty intrange', function() {
        var intrange = range.intrange.empty();
        assert(typeof intrange === "object" && intrange != null, 'Object created');
        assert(intrange.lower === null);
        assert(intrange.upper === null);
    });
});
