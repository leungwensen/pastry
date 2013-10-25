/**
 * @description : try to load original edition of global variables
 * @filename    : brick.origin.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    var o = BR.ori = BR.origin = BR.origin || {};

    /*
     * @param  : {array  } callbackList, list of callback functions.
     * @return : {unknown} value the callback functions try to return.
     * @syntax : BR.origin.tryEach(callbackList) || BR.ori.tryEach(callbackList)
     */
    o.tryAny = o.tryAny || function (callbackList) {
        var i, callback, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            callback = callbackList[i];
            try {
                returnValue = callback();
                break;
            } catch (e) {}
        }
        return returnValue;
    };
}(BR));
