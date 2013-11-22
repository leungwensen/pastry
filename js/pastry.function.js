/**
 * @description : extend for Function
 * @filename    : pastry.function.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    var f = PT.F, fp = PT.FP;
    // Javascript 1.8.5
    /**
     * @description : check if the object has the key
     * @param       : {unkonwn} thisArg, The value to be passed as the this parameter to the target function when the bound function is called.
     * @param       : {unkonwn} argx, Arguments to prepend to arguments provided to the bound function.
     * @syntax      : fun.bind(thisArg[, arg1[, arg2[, ...]]])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
     */
    fp.bind = fp.bind || function (oThis) {
        if (PT.isFunc(oThis)) {
            var aArgs = arguments.slice(1),
                fToBind = this,
                FNOP = function () {},
                fBound = function () {
                    return fToBind.apply(
                            this instanceof FNOP && oThis ? this : oThis || PT.ON,
                            aArgs.concat(arguments)
                        );
                };
            FNOP.prototype   = this.prototype;
            fBound.prototype = new FNOP();
            return fBound;
        }
    };
}(PT));
