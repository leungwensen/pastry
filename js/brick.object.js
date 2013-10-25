/**
 * @description : extend for Object
 * @filename    : brick.object.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    var o = Object, p = o.prototype;

    // Javascript 1.5
    /**
     * @description : check if the object has the key
     * @param       : {string} key, key to check
     * @syntax      : object.hasKey(key) || object.has(key)
     */
    p.has = p.hasKey = p.hasKey || p.hasOwnProperty;

    // extend of Javascript 1.8.x
    /**
     * @description : Executes a provided function once per object element.
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : object.forEach(callback[, thisObj]) || object.each(callback[, thisObj])
     */
    p.each = p.forEach = p.forEach || function (callback, thisObj) {
        var key,
            obj = this;
        for (key in obj){
            if (obj.has(key)) {
                callback.call(thisObj, obj[key], key, obj);
            }
        }
    };
    /**
     * @description : returns an array whose elements are strings corresponding to the enumerable properties found directly upon object.
     * @param       : {object} obj, Object to get keys from.
     * @syntax      : o.keys(obj)
     */
    o.keys = o.keys || function (obj) {
        var key,
            result = [];
        if (BR.isFunc(obj)) {
            obj.each(function (value, key) {
                if (key !== 'prototype') {
                    result.push(key);
                }
            });
        } else {
            obj.each(function (value, key) {
                result.push(key);
            });
        }
        return result;
    };

    // extend of Brick
    /**
     * @description : returns keys of an object
     * @syntax      : object.keys()
     */
    p.keys = p.keys || function () {
        return o.keys(this);
    };
    /**
     * @description : returns an array whose elements are values of the object.
     * @param       : {object} obj, Object to get values from.
     * @syntax      : o.values(obj)
     */
    o.values = o.values || function (obj) {
        var values = [];
        obj.each(function (value) {
            values.push(value);
        });
        return values;
    };
    /**
     * @description : returns values of an object
     * @syntax      : object.values()
     */
    p.values = p.values || function () {
        return o.values(this);
    };
    /**
     * @description : check if the object has the value
     * @param       : {unknown} value, value to check.
     * @syntax      : object.hasValue(value) || object.hasVal(value)
     */
    p.hasVal = p.hasValue = p.hasValue || function (value) {
        return (this.values().indexOf(value) > -1);
    };
}(BR));
