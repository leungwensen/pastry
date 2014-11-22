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
        var date = new Date('2000-01-01T00:00:00Z');

        it('default pattern', function () {
            expect(fmtDate(date))
                .toBe('2000-01-01T00:00:00Z');
        });
        it('{FullYear}-{Month}-{Date}', function () {
            expect(fmtDate(date, '{FullYear}-{Month}-{Date}'))
                .toBe('2000-01-01');
        });
        it('{Hours}:{Minutes}:{Seconds}', function () {
            expect(fmtDate(date, '{Hours}:{Minutes}:{Seconds}'))
                .toBe('00:00:00');
        });
    });
});
