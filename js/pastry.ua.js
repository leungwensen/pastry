/**
 * @description : about browser
 * @filename    : pastry.browser.js
 * @requires    : [pastry.js, pastry.array.js, pastry.string.js]
 */
'use strict';

(function (PT) {
    var matched,
        isNode  = PT.NODEJS,
        win     = PT.ON,
        process = win.process   || {},
        nav     = win.navigator || {},
        plStr   = nav.platform,
        plugs   = nav.plugins,
        uaStr   = PT.UA = nav.userAgent;

    /*
     * @description : host of the window
     * @syntax      : PT.HOST
     */
    if (!isNode) {
        PT.HOST = win.location.host;
        PT.DOC  = win.document;
    }
    /*
     * @description : platform
     * @syntax      : PT.PL | PT.platform
     */
    /*
     * @description : plugins
     * @syntax      : PT.PLUG | PT.plugins
     */
    /*
     * @description : versions
     * @syntax      : PT.VER | PT.versions
     */

    function setVerInt(versions, key, strVal) {
        versions[key] = PT.toInt(strVal);
    }
    function setVer(versions, str, reg) {
        matched = str.match(reg);
        if (matched) {
            setVerInt(versions, matched[0].match(/\w*/)[0], matched[1] || 0);
        }
    }

    /*
     * @description : detect platform
     * @param       : {string} platformStr, platform defined string.
     * @syntax      : PT.detectPL(platformStr)
     * @return      : {string} platform. (mac|windows|linux...)
     */
    PT.detectPL = function (str) {
        if (!PT.isDef(str)) {
            return;
        }
        return str.lc().match(/mac|windows|linux|ipad|ipod|iphone|android/)[0] || 'unknown';
    };

    /*
     * @description : detect plugins (now flash only)
     * @param       : {array } plugins, plugin list
     * @syntax      : PT.detectPLUG(plugins)
     * @return      : {object} { 'flash' : 0|xx }
     */
    PT.detectPLUG = function (arr) {
        return {
            flash: (function () {
                var flash,
                    v      = 0,
                    startV = 13;
                if (arr && arr.length) {
                    flash = arr['Shockwave Flash'];
                    if (flash && flash.description) {
                        v = flash.description.match(/\b(\d+)\.\d+\b/)[1] || v;
                    }
                } else {
                    while (startV --) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startV);
                            v = startV;
                            break;
                        } catch(e) {}
                    }
                }
                return PT.toInt(v);
            }())
        };
    };

    /*
     * @description : detect versions (nodejs: v8 version, node version ,.. ; browsers: browser version, platform version, ...)
     * @param       : {string} userAgent, window.navigator.userAgent
     * @syntax      : PT.detectVer(userAgent)
     * @return      : {object} { 'flash' : 0|xx }
     */
    PT.detectVER = function (str) {
        if (!PT.isDef(str)) {
            return;
        }
        str = str.lc();

        var ieVer,
            versions = {};

        // browser versions
        [
            /msie ([\d.]+)/     ,
            /firefox\/([\d.]+)/ ,
            /chrome\/([\d.]+)/  ,
            /crios\/([\d.]+)/   ,
            /opera.([\d.]+)/    ,
            /adobeair\/([\d.]+)/
        ].each(function (reg) {
            setVer(versions, str, reg);
        });
        // chrome
        if (versions.crios) {
            versions.chrome = versions.crios;
        }
        // detect safari version
        matched = str.match(/version\/([\d.]+).*safari/);
        if (matched) {
            setVerInt(versions, 'safari', matched[1] || 0);
        }
        // detect mobile safari version
        matched = str.match(/version\/([\d.]+).*mobile.*safari/);
        if (matched) {
            setVerInt(versions, 'mobilesafari', matched[1] || 0);
        }

        // engine versions
        [
            /trident\/([\d.]+)/     ,
            /gecko\/([\d.]+)/       ,
            /applewebkit\/([\d.]+)/ ,
            /presto\/([\d.]+)/
        ].each(function (reg) {
            setVer(versions, str, reg);
        });
        ieVer = versions.msie;
        if (ieVer) {
            switch (true) {
                case (ieVer === 6):
                    versions.trident = 4;
                    break;
                case (ieVer === 7 || ieVer === 8):
                    versions.trident = 5;
                    break;
            }
        }

        return versions;
    };

    /*
     * @description : init PT.PL | PT.PLUG | PT.VER for current enviroment
     * @syntax      : PT.initUA()
     */
    PT.initUA = function () {
        PT.PL   = PT.platform = isNode ? {}               : PT.detectPL(plStr);
        PT.PLUG = PT.plugins  = isNode ? process.plugins  : PT.detectPLUG(plugs);
        PT.VER  = PT.versions = isNode ? process.versions : PT.detectVER(uaStr);
    };

    PT.initUA();
}(PT));
