/**
 * @description : extend for Object
 * @filename    : brick.object.js
 * @requires    : [brick.js, brick.array.js]
 */
'use strict';

(function (BR) {
    BR.object = BR.object || Object;

    // extend of Javascript 1.8.x
    /**
     * @description : Executes a provided function once per object element.
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : object.forEach(callback[, thisObj])
     */
    BR.object.prototype.forEach = BR.object.prototype.forEach || function (callback, thisObj) {
        var key;
        for (key in this){
            if (this.hasOwnProperty(key)) {
                callback.call(thisObj, this[key], key, this);
            }
        }
    };
    // alias
    BR.object.prototype.each = BR.object.prototype.each || BR.object.prototype.forEach;
    /**
     * @description : returns an array whose elements are strings corresponding to the enumerable properties found directly upon object.
     * @param       : {object} obj, Object to get keys from.
     * @syntax      : BR.object.keys(obj)
     */
    BR.object.keys = BR.object.keys || function (obj) {
        var i, key,
            keys = [];
        if (BR.isFunction(obj)) {
            for (key in obj) {
                if (obj.hasOwnProperty(key) && key !== 'prototype') {
                    keys.push(key);
                }
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        return keys;
    };

    // extend of Brick
    /**
     * @description : returns keys of an object
     * @syntax      : object.keys()
     */
    BR.object.prototype.keys = BR.object.prototype.keys || function () {
        return Object.keys(this);
    };
    /**
     * @description : returns an array whose elements are values of the object.
     * @param       : {object} obj, Object to get values from.
     * @syntax      : BR.object.values(obj)
     */
    BR.object.values = BR.object.values || function (obj) {
        var i,
            keys = BR.object.keys(obj),
            len = keys.length,
            values = [];
        for (i = 0; i < len; i ++) {
            values.push(obj[keys[i]]);
        }
        return values;
    };
    /**
     * @description : returns values of an object
     * @syntax      : object.values()
     */
    BR.object.prototype.values = BR.object.prototype.values || function () {
        return Object.values(this);
    };
    /**
     * @description : check if the object has the key
     * @param       : {string} key, key to check
     * @syntax      : object.hasKey(key)
     */
    BR.object.prototype.hasKey = BR.object.prototype.hasKey || function (key) {
        return this.hasOwnProperty(key);
    };
    /**
     * @description : check if the object has the value
     * @param       : {unknown} value, value to check.
     * @syntax      : object.hasValue(value)
     */
    BR.object.prototype.hasValue = BR.object.prototype.hasValue || function (value) {
        return (this.values().indexOf(value) > -1);
    };
}(BR));
