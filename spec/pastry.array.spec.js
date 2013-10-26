'use strict';

var arrA, arrB, arrC;

describe('pastry.array.js', function () {
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [];
    });

    it('array.indexOf', function () {
        expect(arrA.indexOf(1)).toBe(0);
        expect(arrA.indexOf(4)).toBe(4);
        expect(arrA.indexOf(5)).toBe(7);
        expect(arrA.indexOf(6)).toBe(-1);
    });
    it('array.lastIndexOf', function () {
        expect(arrA.lastIndexOf(5)).toBe(7);
        expect(arrA.lastIndexOf(3)).toBe(3);
        expect(arrA.lastIndexOf(2)).toBe(1);
        expect(arrA.lastIndexOf(6)).toBe(-1);
    });
    it('array.every', function () {
        expect(arrA.every(function (a) {
            return (a > 0);
        })).toBe(true);
        expect(arrA.every(function (a) {
            return (a > 1);
        })).toBe(false);
    });
    it('array.filter', function () {
        expect(arrA.filter(function (a) {
            return (a > 0);
        })).toEqual(arrA);
        expect(arrA.filter(function (a) {
            return (a > 3);
        })).toEqual([4, 4, 4, 5]);
    });
    it('array.forEach', function () {
        arrA.forEach(function (a) {
            a += 0;
            arrB.push(a);
        });
        expect(arrB).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        arrB = [];
        arrA.forEach(function (a) {
            a += 1;
            arrB.push(a);
        });
        expect(arrB).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('array.map', function () {
        expect(arrA.map(function (a) {
            return a;
        })).toEqual([1, 2, 3, 3, 4, 4, 4, 5]);
        expect(arrA.map(function (a) {
            return a + 1;
        })).toEqual([2, 3, 4, 4, 5, 5, 5, 6]);
    });
    it('array.some', function () {
        expect(arrA.some(function (a) {
            return (a > 4);
        })).toBe(true);
        expect(arrA.some(function (a) {
            return (a > 5);
        })).toBe(false);
    });
});

describe('pastry.array.js', function () {
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [[1, 2], [3, 4], [5, 6]];
    });

    it('array.reduce', function () {
        expect(arrA.reduce(function (a, b) {
            return (a + b);
        })).toBe(26);
        expect(arrB.reduce(function (a, b) {
            return a.concat(b);
        })).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('array.reduceRight', function () {
        expect(arrA.reduceRight(function (a, b) {
            return (a + b);
        }, 10)).toBe(36);
        expect(arrB.reduceRight(function (a, b) {
            return a.concat(b);
        })).toEqual([5, 6, 3, 4, 1, 2]);
    });
});

describe('pastry.array.js', function () {
    beforeEach(function () {
        arrA = [1, 2, 3, 3, 4, 4, 4, 5];
        arrB = [6, 7, 8, 9, 0];
        arrC = [3, 4, 5, 6, 7];
    });

    it('array.binarySearch', function () {
        expect(arrA.binarySearch(3, function (a, b) {
            return (a - b);
        })).toBe(2);
        expect(arrB.binarySearch(3, function (a, b) {
            return (a - b);
        })).toBe(-1);
    });
    it('array.remove', function () {
        arrA.remove(3, 6);
        expect(arrA).toEqual([1, 2, 3, 5]);
        arrB.remove(5, 6);
        expect(arrB).toEqual([6, 7, 8, 9, 0]);
    });
    it('array.replace', function () {
        arrA.replace(3, 8);
        expect(arrA).toEqual([1, 2, 8, 8, 4, 4, 4, 5]);
        arrA.replace(3, 0);
        expect(arrA).toEqual([1, 2, 8, 8, 4, 4, 4, 5]);
    });
    it('array.hasVal', function () {
        expect(arrA.hasVal(1)).toBe(true);
        expect(arrA.hasVal(0)).toBe(false);
    });
    it('array.intersection', function () {
        expect(arrA.intersection(arrB)).toEqual([]);
        expect(arrA.intersection(arrC)).toEqual([3, 4, 5]);
    });
    it('array.complement', function () {
        expect(arrA.complement(arrB)).toEqual([1, 2, 3, 4, 5]);
        expect(arrA.complement(arrC)).toEqual([1, 2]);
    });
    it('array.union', function () {
        expect(arrA.union(arrB)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        expect(arrA.union(arrC)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it('array.uniq', function () {
        expect(arrA.uniq()).toEqual([1, 2, 3, 4, 5]);
    });
});
