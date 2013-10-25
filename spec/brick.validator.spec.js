'use strict';

describe('brick.validator.js', function () {
    it('BR.isArr', function () {
        expect(BR.isArr(1)).toBe(false);
    });

    it('BR.isFunc', function () {
        expect(BR.isFunc(1)).toBe(false);
    });
});
