/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/encoding/cron'
], function (
    pastry,
    cron
) {
    'use strict';

    describe('pastry/encoding/cron', function () {
        var cronObj;
        it('cron.parse(expression)', function () {
            cronObj = cron.parse('*/10 * * * *');
            expect(cronObj.minute).toEqual([0, 10, 20, 30, 40, 50]);

            cronObj = cron.parse('30 21 * * *');
            expect(cronObj.minute).toEqual([30]);
            expect(cronObj.hour).toEqual([21]);

            cronObj = cron.parse('0 11 4 * mon-wed');
            expect(cronObj.hour).toEqual([11]);
            expect(cronObj.minute).toEqual([0]);
            expect(cronObj.dayOfWeek).toEqual([1, 2, 3]);

            cronObj = cron.parse('0 4 1 jan *');
            expect(cronObj.hour).toEqual([4]);
            expect(cronObj.minute).toEqual([0]);
            expect(cronObj.dayOfMonth).toEqual([1]);
            expect(cronObj.month).toEqual([1]);

            cronObj = cron.parse('*/15 8-16,3 * * *');
            expect(cronObj.hour).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 3]);
            expect(cronObj.minute).toEqual([0, 15, 30, 45]);
        });

        it('cron.stringify(cronObj)', function () {
            expect(cron.stringify({
                second     : ['*'],
                minute     : [10, 20, 30],
                hour       : ['*'],
                dayOfMonth : ['*'],
                month      : ['*'],
                dayOfWeek  : ['*'],
            })).toEqual('* 10,20,30 * * * *');
        });
    });
});

