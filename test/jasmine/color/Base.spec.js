/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/color/Base'
], function (
    pastry,
    Color
) {
    'use strict';

    describe('Color', function () {
        it('Color initProps', function () {
            var color = new Color();
console.log(color);
            expect(color.r).toBe(255);
            expect(color.g).toBe(255);
            expect(color.b).toBe(255);
            expect(color.a).toBe(1);
        });
        it('white is #fff', function () {
            expect(Color.fromString('white').toRgba()).toEqual((new Color('#fff')).toRgba());
        });
        it('white is also #ffffff', function () {
            expect(Color.fromString('white').toRgba()).toEqual((new Color('#ffffff')).toRgba());
        });
        it('maroon is #800000', function () {
            expect(Color.fromString('maroon').toRgba()).toEqual((new Color('#800000')).toRgba());
        });

    });
});

