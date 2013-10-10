'use strict';

describe('brick.string.js', function () {
    var strA;

    describe('Javascript 1.8.1 extend', function () {
        beforeEach(function () {
            strA = ' hello,  world! ';
        });
        it('string.trim', function () {
            expect(strA.trim()).toBe('hello,  world!');
        });
    });
});
