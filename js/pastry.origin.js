/**
 * @description : try to load original edition of global variables
 * @filename    : pastry.origin.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    var o = PT.ori = PT.origin = PT.origin || {};

    /*
     * @param  : {array  } callbackList, list of callback functions.
     * @return : {unknown} value the callback functions try to return.
     * @syntax : PT.origin.tryEach(callbackList) || PT.ori.tryEach(callbackList)
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
}(PT));
