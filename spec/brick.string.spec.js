'use strict';

describe('brick.string.js', function () {
    var strA = ' hello,  world! ';
    it('string.trim', function () {
        expect(strA.trim()).toBe('hello,  world!');
    });
});
