/**
 * @description : about running enviroment
 * @filename    : pastry.enviroment.js
 * @requires    : [pastry.js, pastry.array.js, pastry.string.js]
 */
'use strict';

(function (PT) {
    var matched,
        win     = PT.ON,
        process = win.process   || {},
        nav     = win.navigator || {},
        plStr   = nav.platform,
        plugs   = nav.plugins,
        uaStr   = nav.userAgent;

    /*
     * @description : init PT.PL | PT.PLUG | PT.VER for current enviroment
     * @syntax      : PT.initUA()
     */
    PT.initUA = function () {
        /*
         * @description : platform
         * @alias       : PT.platform
         * @syntax      : PT.PL
         */
        /*
         * @description : plugins
         * @alias       : PT.plugins
         * @syntax      : PT.PLUG
         */
        /*
         * @description : versions of browser or nodejs
         * @alias       : PT.versions
         * @syntax      : PT.VER
         */
        /*
         * @description : host of the window
         * @syntax      : PT.HOST
         */
        /*
         * @description : document of the window
         * @syntax      : PT.DOC
         */
        /*
         * @description : userAgent of the browser
         * @alias       : PT.userAgent
         * @syntax      : PT.UA
         */

        if (PT.NODEJS) {
            PT.VER  = PT.versions = process.versions;
        } else {
            PT.HOST = win.location.host;
            PT.DOC  = win.document;
            PT.UA   = PT.userAgent = uaStr;
            PT.PL   = PT.platform  = PT.detectPL(plStr) || PT.detectPL(uaStr) || 'unknown';
            PT.PLUG = PT.plugins   = PT.detectPLUG(plugs);
            PT.VER  = PT.versions  = PT.detectVER(uaStr);
        }
    };

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
        var pls = str.lc().match(/mac|win|linux|ipad|ipod|iphone|android/);
        return PT.isArr(pls) ? pls[0] : pls;
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
        // safari version
        matched = str.match(/version\/([\d.]+).*safari/);
        if (matched) {
            setVerInt(versions, 'safari', matched[1] || 0);
        }
        // mobile safari version
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
        if (ieVer === 6) {
            versions.trident = 4;
        } else if (ieVer === 7 || ieVer === 8) {
            versions.trident = 5;
        }

        return versions;
    };

    PT.initUA();
}(PT));
