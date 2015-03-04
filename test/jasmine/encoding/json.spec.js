/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/encoding/json'
], function (
    pastry,
    JSON
) {
    'use strict';

    describe('json', function () {
        var strJSON = '{"kitcambridge":"Kit","contributors":{"jdalton":"John-David","mathias":"Mathias"},"list":[1,2,3],"number":5,"date":"2012-04-25T14:08:36.879Z","boolean":true,"nil":null}';
        var objJSON = {
            "kitcambridge":"Kit",
            "contributors":{
                "jdalton":"John-David",
                "mathias":"Mathias"
            },
            "list":[ 1, 2, 3 ],
            "number":5,
            "date":"2012-04-25T14:08:36.879Z",
            "boolean":true,
            "nil":null
        };
        it('json.parse(str, strict)', function () {
            expect(JSON.parse(strJSON)).toEqual(objJSON);
        });

        it('json.stringify(value, replacer, spacer)', function () {
            expect(JSON.stringify(objJSON)).toEqual(strJSON);
        });

        it('bug in Firefox 3.5/Gecko 1.9', function () {
            expect(
                JSON.stringify({
                    x   : 1,
                    arr : [1]
                }, function (k, v) {
                    return pastry.isNumber(v) ? 3 : v;
                })
            ).toEqual('{"x":3,"arr":[3]}');
        });
    });
});

