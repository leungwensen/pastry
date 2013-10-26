'use strict';

var numA;

describe('pastry.number.js', function () {
    beforeEach(function () {
        numA = 123456.0789;
    });
    it('number.stringf', function () {
        expect(numA.stringf({})).toEqual('123456.0789');
        expect(numA.stringf()).toEqual('123,456.07');
        expect(numA.stringf({
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 1
        })).toEqual('00,123,456.078');
        expect(numA.stringf({
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 0
        })).toEqual('  123,456.078');
    });
});
