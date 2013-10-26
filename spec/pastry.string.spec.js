'use strict';

describe('pastry.string.js', function () {
    var strA = ' hello,  world! ';
    it('string.trim', function () {
        expect(strA.trim()).toBe('hello,  world!');
    });
});
