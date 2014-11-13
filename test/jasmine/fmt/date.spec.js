/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */
require([
    'pastry',
    'fmt/date'
], function (
    pastry,
    fmtDate
) {
    'use strict';

    describe('fmt/date->fmtDate(date, pattern)', function () {
        var date = new Date('2000-01-01T00:00:00');

        it('default pattern', function () {
            expect(fmtDate(date))
                .toBe('2000-01-01T00:00:00Z');
        });
        it('{YYYY}-{MM}-{DD}', function () {
            expect(fmtDate(date, '{YYYY}-{MM}-{DD}'))
                .toBe('2000-01-01');
        });
        it('{YY}-{M}-{D}', function () {
            expect(fmtDate(date, '{YY}-{M}-{D}'))
                .toBe('00-1-1');
        });
        it('{hh}:{mm}:{ss}', function () {
            expect(fmtDate(date, '{hh}:{mm}:{ss}'))
                .toBe('00:00:00');
        });
        it('{h}:{m}:{s}', function () {
            expect(fmtDate(date, '{h}:{m}:{s}'))
                .toBe('0:0:0');
        });
    });
});
