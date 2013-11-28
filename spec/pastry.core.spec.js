'use strict';

describe('pastry.core.js', function () {
    it('PT.isArr', function () {
        expect(PT.isArr(1)).toBe(false);
    });

    it('PT.isFunc', function () {
        expect(PT.isFunc(1)).toBe(false);
    });
});

describe('pastry.core.js', function () {
    var arrA, arrB, arrC;
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [];
    });

    it('PT.indexOf', function () {
        expect(PT.indexOf(arrA, 1)).toBe(0);
        expect(PT.indexOf(arrA, 4)).toBe(4);
        expect(PT.indexOf(arrA, 5)).toBe(7);
        expect(PT.indexOf(arrA, 6)).toBe(-1);
    });
    it('PT.lastIndexOf', function () {
        expect(PT.lastIndexOf(arrA, 5)).toBe(7);
        expect(PT.lastIndexOf(arrA, 3)).toBe(3);
        expect(PT.lastIndexOf(arrA, 2)).toBe(1);
        expect(PT.lastIndexOf(arrA, 6)).toBe(-1);
    });
    it('PT.every', function () {
        expect(PT.every(arrA, function (a) {
            return (a > 0);
        })).toBe(true);
        expect(PT.every(arrA, function (a) {
            return (a > 1);
        })).toBe(false);
    });
    it('PT.filter', function () {
        expect(PT.filter(arrA, function (a) {
            return (a > 0);
        })).toEqual(arrA);
        expect(PT.filter(arrA, function (a) {
            return (a > 3);
        })).toEqual([4, 4, 4, 5]);
    });
    it('PT.forEach', function () {
        PT.forEach(arrA, function (a) {
            a += 0;
            arrB.push(a);
        });
        expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        arrB = [];
        PT.forEach(arrA, function (a) {
            a += 1;
            arrB.push(a);
        });
        expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('PT.map', function () {
        expect(PT.map(arrA, function (a) {
            return a;
        })).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        expect(PT.map(arrA, function (a) {
            return a + 1;
        })).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('PT.some', function () {
        expect(PT.some(arrA, function (a) {
            return (a > 4);
        })).toBe(true);
        expect(PT.some(arrA, function (a) {
            return (a > 5);
        })).toBe(false);
    });
});

describe('pastry.core.js', function () {
    var arrA, arrB, arrC;
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [[1, 2], [3, 4], [5, 6]];
    });

    it('PT.reduce', function () {
        expect(PT.reduce(arrA, function (a, b) {
            return (a + b);
        })).toBe(26);
        expect(PT.reduce(arrB, function (a, b) {
            return a.concat(b);
        })).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('PT.reduceRight', function () {
        expect(PT.reduceRight(arrA, function (a, b) {
            return (a + b);
        }, 10)).toBe(36);
        expect(PT.reduceRight(arrB, function (a, b) {
            return a.concat(b);
        })).toEqual([5, 6, 3, 4, 1, 2]);
    });
});

describe('pastry.core.js', function () {
    var arrA, arrB, arrC;
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [6, 7, 8, 9, 0];
        arrC = [3, 4, 5, 6, 7];
    });

    it('PT.binarySearch', function () {
        expect(PT.binarySearch(arrA, 3, function (a, b) {
            return (a - b);
        })).toBe(2);
        expect(PT.binarySearch(arrB, 3, function (a, b) {
            return (a - b);
        })).toBe(-1);
    });
    it('PT.remove', function () {
        PT.remove(arrA, 3, 6);
        expect(arrA).toEqual([1, 2, 3, 5]);
        PT.remove(arrB, 5, 6);
        expect(arrB).toEqual([6, 7, 8, 9, 0]);
    });
    it('PT.replace', function () {
        PT.replace(arrA, 3, 8);
        expect(arrA).toEqual([1, 2, 8, 8, 4, 4, 4, 5]);
        PT.replace(arrA, 3, 0);
        expect(arrA).toEqual([1, 2, 8, 8, 4, 4, 4, 5]);
    });
    it('PT.hasVal', function () {
        expect(PT.hasVal(arrA, 1)).toBe(true);
        expect(PT.hasVal(arrA, 0)).toBe(false);
    });
    it('PT.intersection', function () {
        expect(PT.intersection(arrA, arrB)).toEqual([]);
        expect(PT.intersection(arrA, arrC)).toEqual([3, 4, 5]);
    });
    it('PT.complement', function () {
        expect(PT.complement(arrA, arrB)).toEqual([1, 2, 3, 4, 5]);
        expect(PT.complement(arrA, arrC)).toEqual([1, 2]);
    });
    it('PT.union', function () {
        expect(PT.union(arrA, arrB)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        expect(PT.union(arrA, arrC)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it('PT.uniq', function () {
        expect(PT.uniq(arrA)).toEqual([1, 2, 3, 4, 5]);
    });
});

describe('pastry.core.js', function () {
    var strA = ' hello,  world! ';
    it('PT.trim()', function () {
        expect(strA.trim()).toBe('hello,  world!');
    });
});
