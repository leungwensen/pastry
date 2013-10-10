'use strict';

describe('brick.date.js', function () {
    var dateA;

    describe('brick.js extend', function () {
        beforeEach(function () {
            dateA = new Date(1995,11,17,3,24,0);
        });
        it('date.toFormatString', function () {
            expect(dateA.toFormatString()).toEqual('1995-11-17 03:24:00');
            expect(dateA.toFormatString('{YYYY}年{MM}月{DD}日 {hh}时{mm}分{ss}秒')).toEqual('1995年11月17日 03时24分00秒');
            expect(dateA.toFormatString('{YY}年{M}月{D}日 {h}时{m}分{s}秒')).toEqual('95年11月17日 3时24分0秒');
        });
    });
});
