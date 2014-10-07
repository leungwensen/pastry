
var noop = function () { };

describe('core->C.is$Type(obj)', function () {
    it('C.isArguments', function () {
        expect(C.isArguments([])).toBe(false);
        expect(C.isArguments(arguments)).toBe(true);
    });
    it('C.isArray', function () {
        expect(C.isArray([])).toBe(true);
        expect(C.isArray(1)).toBe(false);
    });
    it('C.isBoolean', function () {
        expect(C.isBoolean(true)).toBe(true);
        expect(C.isBoolean(false)).toBe(true);
        expect(C.isBoolean(1)).toBe(false);
    });
    it('C.isFunction', function () {
        expect(C.isFunction(noop)).toBe(true);
        expect(C.isFunction(1)).toBe(false);
    });
    it('C.isNumber', function () {
        expect(C.isNumber(NaN)).toBe(true);
        expect(C.isNumber(1)).toBe(true);
        expect(C.isNumber('1')).toBe(false);
    });
    it('C.isFinite', function () {
        expect(C.isFinite(NaN)).toBe(false);
        expect(C.isFinite(1)).toBe(true);
        expect(C.isFinite('1')).toBe(false); // 这里和 underscore.js 行为不同
    });
    it('C.isObject', function () {
        expect(C.isObject({})).toBe(true);
        expect(C.isObject(null)).toBe(false);
        expect(C.isObject(noop.prototype)).toBe(true);
        expect(C.isObject(noop)).toBe(false); // 和 underscore.js 行为不同
    });
});

describe('core->helper functions of arrays', function () {
    var arrA, arrB;
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [];
    });

    it('C.indexOf(arr, searchElement, fromIndex)', function () {
        expect(C.indexOf(arrA, 1)).toBe(0);
        expect(C.indexOf(arrA, 4)).toBe(4);
        expect(C.indexOf(arrA, 5)).toBe(7);
        expect(C.indexOf(arrA, 6)).toBe(-1);
    });
    it('C.lastIndexOf(arr, searchElement, fromIndex)', function () {
        expect(C.lastIndexOf(arrA, 5)).toBe(7);
        expect(C.lastIndexOf(arrA, 3)).toBe(3);
        expect(C.lastIndexOf(arrA, 2)).toBe(1);
        expect(C.lastIndexOf(arrA, 6)).toBe(-1);
    });
    it('C.forEach(obj, callback, thisObj)', function () {
        C.forEach(arrA, function (a) {
            a += 0;
            arrB.push(a);
        });
        expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        arrB = [];
        C.forEach(arrA, function (a) {
            a += 1;
            arrB.push(a);
        });
        expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('C.each(obj, callback, thisObj)', function () { // alias
        C.each(arrA, function (a) {
            a += 0;
            arrB.push(a);
        });
        expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        arrB = [];
        C.each(arrA, function (a) {
            a += 1;
            arrB.push(a);
        });
        expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('C.remove(arr, fromIndex, toIndex)', function () { // alias
        C.remove(arrA, 0, 2);
        expect(arrA).toEqual([3, 4, 4, 4, 5]);
        C.remove(arrA, 0);
        expect(arrA).toEqual([4, 4, 4, 5]);
        C.remove(arrA, 0, -1);
        expect(arrA).toEqual([]);
    });
});

describe('core->others', function () {
    it('C.getAny', function () {
        expect(C.getAny([
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
    C.merge(destObj1, obj1, obj2, obj3);
    it('C.merge(dest)', function () { // 深度合并
        expect(destObj1.hello).toBe('world');
        expect(destObj1.foo).toBe('too');
        expect(destObj1.bar.woo).toBe('waaa');
        expect(destObj1.bar.hi).toBe('hello');
        expect(destObj1.bar.wee.hoo).toBe('gee');
        expect(destObj1.bar.wee.hi).toBe('hoo');
    });
    C.extend(destObj2, obj1, obj2, obj3);
    it('C.extend(dest)', function () { // 扩展
        expect(destObj2.hello).toBe('world');
        expect(destObj2.foo).toBe('too');
        expect(destObj2.bar.woo).toBe('waaa');
        expect(destObj2.bar.hi).toBe(undefined);
        expect(destObj2.bar.wee.hoo).toBe(undefined);
        expect(destObj2.bar.wee.hi).toBe('hoo');
    });
});

