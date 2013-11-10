'use strict';

var dateA;

describe('pastry.date.js', function () {
    beforeEach(function () {
        dateA = new Date(1995, 11, 17, 3, 24);
    });
    it('date.stringf()', function () {
        expect(dateA.stringf()).toEqual('1995-12-17 03:24:00');
        expect(dateA.stringf('{YYYY}年{MM}月{DD}日 {hh}时{mm}分{ss}秒')).toEqual('1995年12月17日 03时24分00秒');
        expect(dateA.stringf('{YY}年{M}月{D}日 {h}时{m}分{s}秒')).toEqual('95年12月17日 3时24分0秒');
    });
});
