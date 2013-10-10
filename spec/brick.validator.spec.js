'use strict';

describe('brick.validator.js', function () {
    describe('brick.js extend', function () {
        expect(BR.validator.isArray(1)).toBe(false);

        expect(BR.validator.isFunction(1)).toBe(false);
    });
});
