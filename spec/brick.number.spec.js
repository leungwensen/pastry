'use strict';

var numA;

describe('brick.number.js', function () {
    beforeEach(function () {
        numA = 123456.0789;
    });
    it('number.toFormatString', function () {
        expect(numA.toFormatString({})).toEqual('123456.0789');
        expect(numA.toFormatString()).toEqual('123,456.07');
        expect(numA.toFormatString({
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 1
        })).toEqual('00,123,456.078');
        expect(numA.toFormatString({
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 0
        })).toEqual('  123,456.078');
    });
});
