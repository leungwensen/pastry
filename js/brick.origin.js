/**
 * @description : try to load original edition of global variables
 * @filename    : brick.origin.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    BR.origin = BR.origin || {};

    /*
     * @param  : {array  } callbackList, list of callback functions.
     * @return : {unknown} value the callback functions try to return.
     * @syntax : BR.origin.tryOneOf(callbackList)
     */
    BR.origin.tryOneOf = BR.origin.tryOneOf || function (callbackList) {
        var i, callback, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            callback = callbackList[i];
            try {
                returnValue = callback();
                break;
            } catch (e) {
            }
        }
        return returnValue;
    };
}(BR));
