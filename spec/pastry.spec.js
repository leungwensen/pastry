'use strict';

describe('pastry.validator.js', function () {
    it('PT.isArr', function () {
        expect(PT.isArr(1)).toBe(false);
    });

    it('PT.isFunc', function () {
        expect(PT.isFunc(1)).toBe(false);
    });
});
