/**
 * @description : PT.IO
 * @filename    : pastry.io.js
 * @requires    : [pastry.js, pastry.array.js, pastry.environment.js, pastry.string.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /*
     * @description : XMLHttpRequest Object
     * @syntax      : PT.getXHR()
     */
    PT.getXHR = function () {
        return PT.tryAny([
            function () { return new XMLHttpRequest();                   },
            function () { return new ActiveXObject('MSXML2.XMLHTTP');    },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
        ]);
    };

    /*
     * @description : ajax.
     * @syntax      : PT.ajax(uri[, option])[.error(callback)][.success(callback)]..
     * @param       : {String} uri, uri.
     * @param       : {Object} option, option.
     * @return      : {this  } return itself for chain operations.
     */
    PT.ajax = function (uri, option) {
        option = option || {};
        var xhr         = PT.getXHR(),
            method      = option.method ? PT.uc(option.method)               : 'GET',
            type        = option.type   ? PT.lc(option.type)                 : 'xml',
            data        = option.data   ? PT.QueryStr.stringify(option.data) : null,
            contentType = option.contentType,
            isAsync     = option.isAsync;

        /*
         * @description : event handlers.
         * @syntax      : PT.ajax(uri[, option]).xxx(callback)..
         * @param       : {Function} callback, callback function.
         */
        /*
         * @syntax : PT.ajax(uri[, option]).abort(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).error(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).load(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).loadend(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).loadstart(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).progress(callback)..
         */
        /*
         * @description : success event handler
         * @syntax      : PT.ajax(uri[, option]).success(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).timeout(callback)..
         */
        PT.each([
            'abort'     ,
            'error'     ,
            'load'      ,
            'loadend'   ,
            'loadstart' ,
            'progress'  ,
            'success'   ,
            'timeout'
        ], function (handler) {
            if (option[handler]) {
                xhr['on' + handler] = option[handler];
            }
        });

        /*
         * @description : is ajax request success
         * @syntax      : $PT.ajax.isSuccess()
         * @return      : {Boolean} is ajax request successfully porformed
         */
        xhr.isSuccess = function () {
            return (xhr.status >= 200 && xhr.status < 300)              ||
                   (xhr.status === 304)                                 ||
                   (!xhr.status && PT.ON.location.protocol === 'file:') ||
                   (!xhr.status && PT.VER.safari);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.isSuccess() && option.success) {
                    var response = xhr.responseText;
                    if (type === 'json') {
                        response = PT.tryAny([function () { return PT.JSON.parse(response); }]) || response;
                    }
                    xhr.onsuccess(response);
                } else if (option.error) {
                    xhr.onerror(xhr.statusText);
                }
            }
        };

        // progress ajax
        if (method === 'GET') {
            if (data) {
                uri += (PT.hasSub(uri, '?') ? '&' : '?') + data;
            }
            xhr.open(method, uri, isAsync);
            xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'text/plain;charset=UTF-8'
                );
        } else if (method === 'POST'){
            xhr.open(method, uri, isAsync);
            xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
                );
        } else {
            xhr.open(method, uri, isAsync);
        }
        xhr.send(data);
    };

    PT.each([
        'get' ,
        'post'
    ], function (method) {
        PT[method] = function (uri, option) {
            option.method = method;
            PT.ajax(uri, option);
        };
    });
}(PT));
