'use strict';

describe('pastry.format.js', function () {
    var dateA;

    beforeEach(function () {
        dateA = new Date(1995, 11, 17, 3, 24);
    });
    it('PT.FMT.date()', function () {
        expect(PT.FMT.date(dateA)).toEqual('1995-12-17 03:24:00');
        expect(PT.FMT.date(dateA, '{YYYY}年{MM}月{DD}日 {hh}时{mm}分{ss}秒')).toEqual('1995年12月17日 03时24分00秒');
        expect(PT.FMT.date(dateA, '{YY}年{M}月{D}日 {h}时{m}分{s}秒')).toEqual('95年12月17日 3时24分0秒');
    });
});

describe('pastry.format.js', function () {
    var numA;

    beforeEach(function () {
        numA = 123456.0789;
    });
    it('PT.FMT.num()', function () {
        expect(PT.FMT.num(numA, {})).toEqual('123456.0789');
        expect(PT.FMT.num(numA)).toEqual('123,456.07');
        expect(PT.FMT.num(numA, {
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 1
        })).toEqual('00,123,456.078');
        expect(PT.FMT.num(numA, {
            'comma'   : 1,
            'decimal' : 3,
            'integer' : 8,
            'zero'    : 0
        })).toEqual('  123,456.078');
    });
});
