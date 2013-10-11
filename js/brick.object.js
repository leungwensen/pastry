/**
 * @description : extend for Object
 * @filename    : brick.object.js
 * @requires    : [brick.js, brick.array.js]
 */
'use strict';

(function (BR, undefined) {
    BR.object = BR.object || Object;

    // extend of Javascript 1.8.x
    /**
     * @description : Executes a provided function once per object element.
     * @parameters  : {function} callback , Function to execute for each element.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : object.forEach(callback[, thisObj])
     */
    BR.object.prototype.forEach = BR.object.prototype.forEach || function(callback, thisObj){
        var key;
        for (key in this){
            if (this.hasOwnProperty(key)) {
                callback.call(thisObj, this[key], key, this);
            }
        }
    };
    // alias
    BR.object.prototype.each = BR.object.prototype.each || BR.object.prototype.forEach;
}(BR));
