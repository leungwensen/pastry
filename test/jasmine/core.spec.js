/* jshint strict: true, undef: true, unused: true */
/* global P, describe, it, expect, beforeEach */
(function () {
    'use strict';

    var noop = function () { };

    describe('core->P.is$Type(obj)', function () {
        it('P.isArguments', function () {
            expect(P.isArguments([])).toBe(false);
            expect(P.isArguments(arguments)).toBe(true);
        });
        it('P.isArray', function () {
            expect(P.isArray([])).toBe(true);
            expect(P.isArray(1)).toBe(false);
        });
        it('P.isBoolean', function () {
            expect(P.isBoolean(true)).toBe(true);
            expect(P.isBoolean(false)).toBe(true);
            expect(P.isBoolean(1)).toBe(false);
        });
        it('P.isFunction', function () {
            expect(P.isFunction(noop)).toBe(true);
            expect(P.isFunction(1)).toBe(false);
        });
        it('P.isNumber', function () {
            expect(P.isNumber(NaN)).toBe(true);
            expect(P.isNumber(1)).toBe(true);
            expect(P.isNumber('1')).toBe(false);
        });
        it('P.isFinite', function () {
            expect(P.isFinite(NaN)).toBe(false);
            expect(P.isFinite(1)).toBe(true);
            expect(P.isFinite('1')).toBe(false); // 这里和 underscore.js 行为不同
        });
        it('P.isObject', function () {
            expect(P.isObject({})).toBe(true);
            expect(P.isObject(null)).toBe(false);
            expect(P.isObject(noop.prototype)).toBe(true);
            expect(P.isObject(noop)).toBe(false); // 和 underscore.js 行为不同
        });
    });

    describe('core->helper functions of arrays', function () {
        var arrA, arrB;
        beforeEach(function () {
            arrA = [1, 2, 3, 3, 4, 4, 4, 5];
            arrB = [];
        });

        it('P.indexOf(arr, searchElement, fromIndex)', function () {
            expect(P.indexOf(arrA, 1)).toBe(0);
            expect(P.indexOf(arrA, 4)).toBe(4);
            expect(P.indexOf(arrA, 5)).toBe(7);
            expect(P.indexOf(arrA, 6)).toBe(-1);
        });
        it('P.lastIndexOf(arr, searchElement, fromIndex)', function () {
            expect(P.lastIndexOf(arrA, 5)).toBe(7);
            expect(P.lastIndexOf(arrA, 3)).toBe(3);
            expect(P.lastIndexOf(arrA, 2)).toBe(1);
            expect(P.lastIndexOf(arrA, 6)).toBe(-1);
        });
        it('P.forEach(obj, callback, thisObj)', function () {
            P.forEach(arrA, function (a) {
                a += 0;
                arrB.push(a);
            });
            expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
            arrB = [];
            P.forEach(arrA, function (a) {
                a += 1;
                arrB.push(a);
            });
            expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
        });
        it('P.each(obj, callback, thisObj)', function () { // alias
            P.each(arrA, function (a) {
                a += 0;
                arrB.push(a);
            });
            expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
            arrB = [];
            P.each(arrA, function (a) {
                a += 1;
                arrB.push(a);
            });
            expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
        });
        it('P.remove(arr, fromIndex, toIndex)', function () {
            P.remove(arrA, 0, 2);
            expect(arrA).toEqual([3, 4, 4, 4, 5]);
            P.remove(arrA, 0);
            expect(arrA).toEqual([4, 4, 4, 5]);
            P.remove(arrA, 0, -1);
            expect(arrA).toEqual([]);
        });
        it('CANNOT use P.remove() inside of P.each() callback to THE SAME ARRAY', function () {
            P.each(arrA, function (num, i) {
                if (num === 4) {
                    P.remove(arrA, i);
                }
            });
            // expect(arrA).toEqual([1, 2, 3, 3, 5]); // !!!!!!!!!! REMEMBER THIS !!!!!!!!!!
            expect(arrA).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        });
        var obj = {
            foo: 'bar',
            hoo: 'goo'
        };
        it('delete in P.each()', function () {
            P.each(obj, function (value, key) {
                if (value === 'bar') {
                    delete obj[key];
                }
            });
            expect(obj).toEqual({
                hoo: 'goo'
            });
            expect(obj.foo).toBe(undefined);
        });
    });

    describe('core->others', function () {
        it('P.getAny', function () {
            expect(P.getAny([
                function () {
                    throw new Error('hi');
                },
                function () {
                    throw new Error('error');
                },
                function () {
                    return 'hello';
                },
            ])).toBe('hello');
        });
    });

    describe('core->helper functions of objects', function () {
        var destObj1 = {},
            destObj2 = {},
            obj1 = {
                hello: 'world'
            },
            obj2 = {
                foo: 'bar',
                bar: {
                    hi: 'hello',
                    woo: 'weee',
                    wee: {
                        hoo: 'gee',
                        hi: 'hi'
                    }
                }
            },
            obj3 = {
                foo: 'too',
                bar: {
                    woo: 'waaa',
                    wee: {
                        hi: 'hoo'
                    }
                }
            };
        P.merge(destObj1, obj1, obj2, obj3);
        it('P.merge(dest)', function () { // 深度合并
            expect(destObj1.hello).toBe('world');
            expect(destObj1.foo).toBe('too');
            expect(destObj1.bar.woo).toBe('waaa');
            expect(destObj1.bar.hi).toBe('hello');
            expect(destObj1.bar.wee.hoo).toBe('gee');
            expect(destObj1.bar.wee.hi).toBe('hoo');
        });
        P.extend(destObj2, obj1, obj2, obj3);
        it('P.extend(dest)', function () { // 扩展
            expect(destObj2.hello).toBe('world');
            expect(destObj2.foo).toBe('too');
            expect(destObj2.bar.woo).toBe('waaa');
            expect(destObj2.bar.hi).toBe(undefined);
            expect(destObj2.bar.wee.hoo).toBe(undefined);
            expect(destObj2.bar.wee.hi).toBe('hoo');
        });
    });
}(P));
