'use strict';

describe('pastry.json.js', function () {
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
    it('PT.JSON.parse()', function () {
        expect(PT.JSON.parse(strJSON)).toEqual(objJSON);
    });

    it('PT.JSON.stringify()', function () {
        expect(PT.JSON.stringify(objJSON)).toEqual(strJSON);
    });
});
