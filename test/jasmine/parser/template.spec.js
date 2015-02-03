/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/parser/template'
], function (
    pastry,
    template
) {
    'use strict';
    // TODO add more!

    describe('template', function () {
        it('template.render', function () {
            expect(template.render("the girl jumps up sayin' `{%= thing %}`", {
                thing: 'harry potter!'
            })).toBe("the girl jumps up sayin' `harry potter!`");
        });
    });
});

