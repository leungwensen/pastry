/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/fmt/camelCase'
], function (
    pastry,
    camelCase
) {
    'use strict';

    var obj = {
            fee_fie_foe: 'fum',
            beep_boop: [{
                'abc.xyz': 'mno'
            }, {
                'foo-bar': 'baz'
            }]
        },
        res = {
            feeFieFoe: 'fum',
            beepBoop: [{
                abcXyz: 'mno'
            }, {
                fooBar: 'baz'
            }]
        },
        uncameliseRes = {
            fee_fie_foe: 'fum',
            beep_boop: [{
                abc_xyz: 'mno'
            }, {
                foo_bar: 'baz'
            }]
        };

    describe('fmt/camelCase->camelise()', function () {
        it('Strings', function () {
            expect(camelCase.camelise('one_two')).toBe('oneTwo');
            expect(camelCase.camelise('one.two')).toBe('oneTwo');
            expect(camelCase.camelise('one-two')).toBe('oneTwo');
        });
        it('Objects', function () {
            expect(camelCase.camelise(obj)).toEqual(res);
        });
    });

    describe('fmt/camelCase->umcamelise()', function () {
        it('Strings', function () {
            expect(camelCase.uncamelise('oneTwo')).toBe('one_two');
            expect(camelCase.uncamelise('oneTwo', '.')).toBe('one.two');
            expect(camelCase.uncamelise('oneTwo', '-')).toBe('one-two');
        });
        it('Objects', function () {
            expect(camelCase.uncamelise(res)).toEqual(uncameliseRes);
        });
    });
});

