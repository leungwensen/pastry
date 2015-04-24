/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */

require([
    'pastry/pastry',
    'pastry/encoding/json'
], function (
    pastry,
    json
) {
    'use strict';

    describe('pastry/encoding/json', function () {
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
            expect(json.parse(strJSON)).toEqual(objJSON);
        });

        it('json.stringify(value, replacer, spacer)', function () {
            expect(json.stringify(objJSON)).toEqual(strJSON);
        });

        it('bug in Firefox 3.5/Gecko 1.9', function () {
            expect(
                json.stringify({
                    x   : 1,
                    arr : [1]
                }, function (k, v) {
                    return pastry.isNumber(v) ? 3 : v;
                })
            ).toEqual('{"x":3,"arr":[3]}');
        });
    });
});

