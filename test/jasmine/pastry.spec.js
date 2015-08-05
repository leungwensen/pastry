/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect, beforeEach */

require([
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';

    var noop = function () { };

    describe('core->pastry.is$Type(obj)', function () {
        it('pastry.isArguments', function () {
            expect(pastry.isArguments([])).toBe(false);
            expect(pastry.isArguments(arguments)).toBe(true);
        });
        it('pastry.isArray', function () {
            expect(pastry.isArray([])).toBe(true);
            expect(pastry.isArray(1)).toBe(false);
        });
        it('pastry.isBoolean', function () {
            expect(pastry.isBoolean(true)).toBe(true);
            expect(pastry.isBoolean(false)).toBe(true);
            expect(pastry.isBoolean(1)).toBe(false);
        });
        it('pastry.isFunction', function () {
            expect(pastry.isFunction(noop)).toBe(true);
            expect(pastry.isFunction(1)).toBe(false);
        });
        it('pastry.isNumber', function () {
            expect(pastry.isNumber(NaN)).toBe(true);
            expect(pastry.isNumber(1)).toBe(true);
            expect(pastry.isNumber('1')).toBe(false);
        });
        it('pastry.isFinite', function () {
            expect(pastry.isFinite(NaN)).toBe(false);
            expect(pastry.isFinite(1)).toBe(true);
            expect(pastry.isFinite('1')).toBe(false); // 这里和 underscore.js 行为不同
        });
        it('pastry.isObject', function () {
            expect(pastry.isObject({})).toBe(true);
            expect(pastry.isObject(null)).toBe(false);
            expect(pastry.isObject(noop.prototype)).toBe(true);
            expect(pastry.isObject(noop)).toBe(true);
        });
    });

    describe('core->helper functions of arrays', function () {
        var arrA, arrB,
            indexOf = pastry.index(true),
            lastIndexOf = pastry.index(false);

        beforeEach(function () {
            arrA = [1, 2, 3, 3, 4, 4, 4, 5];
            arrB = [];
        });

        it('pastry.indexOf(arr, searchElement, fromIndex)', function () {
            expect(indexOf(arrA, 1)).toBe(0);
            expect(indexOf(arrA, 4)).toBe(4);
            expect(indexOf(arrA, 5)).toBe(7);
            expect(indexOf(arrA, 6)).toBe(-1);
        });

        it('pastry.lastIndexOf(arr, searchElement, fromIndex)', function () {
            expect(lastIndexOf(arrA, 5)).toBe(7);
            expect(lastIndexOf(arrA, 3)).toBe(3);
            expect(lastIndexOf(arrA, 2)).toBe(1);
            expect(lastIndexOf(arrA, 6)).toBe(-1);
        });
        it('pastry.forEach(obj, callback, thisObj)', function () {
            pastry.forEach(arrA, function (a) {
                a += 0;
                arrB.push(a);
            });
            expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
            arrB = [];
            pastry.forEach(arrA, function (a) {
                a += 1;
                arrB.push(a);
            });
            expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
        });
        it('pastry.every(obj, callback, thisObj)', function () { // alias
            expect(pastry.every(arrA, function(item) {
                return item === 4;
            })).toEqual(false);
        });
        it('pastry.some(obj, callback, thisObj)', function () { // alias
            expect(pastry.some(arrA, function(item) {
                return item === 4;
            })).toEqual(true);
        });
        it('pastry.each(obj, callback, thisObj)', function () { // alias
            pastry.each(arrA, function (a) {
                a += 0;
                arrB.push(a);
            });
            expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
            arrB = [];
            pastry.each(arrA, function (a) {
                a += 1;
                arrB.push(a);
            });
            expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
        });
        it('pastry.remove(arr, fromIndex, toIndex)', function () {
            pastry.remove(arrA, 0, 2);
            expect(arrA).toEqual([3, 4, 4, 4, 5]);
            pastry.remove(arrA, 0);
            expect(arrA).toEqual([4, 4, 4, 5]);
            pastry.remove(arrA, 0, -1);
            expect(arrA).toEqual([]);
        });
        it('CANNOT use pastry.remove() inside of pastry.each() callback to THE SAME ARRAY', function () {
            pastry.each(arrA, function (num, i) {
                if (num === 4) {
                    pastry.remove(arrA, i);
                }
            });
            // expect(arrA).toEqual([1, 2, 3, 3, 5]); // !!!!!!!!!! REMEMBER THIS !!!!!!!!!!
            // expect(arrA).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        });
        var obj = {
            foo: 'bar',
            hoo: 'goo'
        };
        it('delete in pastry.each()', function () {
            pastry.each(obj, function (value, key) {
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

    describe('core->helper functions of functions', function () {
        it('pastry.bind', function () {
            function foo1() {
                return this.hello;
            }

            var bar1 = pastry.bind(foo1, {hello: 'pastry'});
            expect(bar1()).toEqual('pastry');

            function foo2() {
                return arguments[0];
            }

            var bar2 = pastry.bind(foo2, null, 'pastry');
            expect(bar2()).toEqual('pastry');

            function foo3() {
                return arguments[1];
            }

            var bar3 = pastry.bind(foo3, null, 'hello');
            expect(bar3('pastry')).toEqual('pastry');
        });
    });
    describe('core->helper functions of cullections', function () {
        it('pastry.reduce', function () {
            var sum = pastry.reduce([1, 2, 3], function(sum, num){ return sum + num; }, 0);
            expect(sum).toBe(6);
        });
        it('pastry.union', function () {
            expect(pastry.union([1, 2], [0, 1, 2, 4], [4, 5])).toEqual([
                1, 2, 0, 4, 5
            ]);
        });
        it('pastry.uniq', function () {
            expect(pastry.uniq([1, 2, 2, 3, 4, 5, 5, 5, 6])).toEqual([
                1, 2, 3, 4, 5, 6
            ]);
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
                },
                hello: [
                    'world',
                    'html',
                    'pastry'
                ]
            };
        pastry.merge(destObj1, obj1, obj2, obj3);
        it('pastry.merge(dest)', function () { // 深度合并
            // expect(destObj1.hello).toBe('world');
            expect(destObj1.foo).toBe('too');
            expect(destObj1.bar.woo).toBe('waaa');
            expect(destObj1.bar.hi).toBe('hello');
            expect(destObj1.bar.wee.hoo).toBe('gee');
            expect(destObj1.bar.wee.hi).toBe('hoo');
            console.log(destObj1.hello);
            expect(destObj1.hello).toEqual(['world', 'html', 'pastry']);
            expect(Object.prototype.toString.call(destObj1.hello)).toBe('[object Array]');
        });
        pastry.extend(destObj2, obj1, obj2, obj3);
        it('pastry.extend(dest)', function () { // 扩展
            expect(destObj1.hello).toEqual(['world', 'html', 'pastry']);
            expect(destObj2.foo).toBe('too');
            expect(destObj2.bar.woo).toBe('waaa');
            expect(destObj2.bar.hi).toBe(undefined);
            expect(destObj2.bar.wee.hoo).toBe(undefined);
            expect(destObj2.bar.wee.hi).toBe('hoo');
        });
    });

    describe('core->others', function () {
        it('pastry.getAny', function () {
            expect(pastry.getAny([
                function () {
                    pastry.ERROR('hi');
                },
                function () {
                    pastry.ERROR('error');
                },
                function () {
                    return 'hello';
                },
            ])).toBe('hello');
        });
    });
});

