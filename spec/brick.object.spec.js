'use strict';

var objA, objB;

describe('brick.object.js', function () {
    beforeEach(function () {
        objA = {
            'hello': 'world'
        };
        objB = {};
    });

    it('object.forEach', function () {
        objA.forEach(function (a) {
            objB[a] = 1;
        });
        expect(objB).toEqual({'world': 1});
    });
    it('Object.keys', function () {
        expect(BR.object.keys(['a', 'b', 'c'])).toEqual(['0', '1', '2']);
        expect(BR.object.keys(objA)).toEqual(['hello']);
    });
});

describe('brick.object.js', function () {
    it('object.keys', function () {
        expect(objA.keys()).toEqual(['hello']);
    });
    it('Object.values', function () {
        expect(BR.object.values(objA)).toEqual(['world']);
    });
    it('object.values', function () {
        expect(objA.values()).toEqual(['world']);
    });
    it('object.hasKey', function () {
        expect(objA.hasKey('hello')).toBe(true);
        expect(objA.hasKey('foo')).toBe(false);
    });
    it('object.hasValue', function () {
        expect(objA.hasValue('world')).toBe(true);
        expect(objA.hasValue('bar')).toBe(false);
    });
});

