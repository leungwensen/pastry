'use strict';

describe('brick.validator.js', function () {
    it('BR.isArray', function () {
        expect(BR.isArray(1)).toBe(false);
    });

    it('BR.isFunction', function () {
        expect(BR.isFunction(1)).toBe(false);
    });
});
