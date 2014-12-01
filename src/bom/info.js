/* jshint strict: true, undef: true, unused: true */
/* global define, location, navigator, ActiveXObject */

define('bom/info', [
    'pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云 (wensen.lws@alibaba-inc.com)
     * @description : 记录各种浏览器相关的版本号
     * @note        : browser only
     */
    var nav       = navigator || {},
        userAgent = nav.userAgent,
        platform  = nav.platform,
        plugins   = nav.plugins;

    function toInt (value, base) {
        return parseInt(value, base || 10);
    }
    function setVerInt (versions, key, strVal) {
        versions[key] = toInt(strVal);
    }
    function setVer (versions, str, reg) {
        var matched = str.match(reg);
        if (matched) {
            setVerInt(versions, matched[0].match(/\w*/)[0], matched[1] || 0);
        }
    }
    function detectPlatform (str) {
        /*
         * @description : detect platform
         * @param       : {string} platformStr, platform defined string.
         * @syntax      : detectPlatform(platformStr)
         * @return      : {string} platform. (mac|windows|linux...)
         */
        if (!str) {
            return;
        }
        var result = pastry.lc(str).match(/mac|win|linux|ipad|ipod|iphone|android/);
        return pastry.isArray(result) ? result[0] : result;
    }
    function detectPlugin (arr) {
        /*
         * @description : detect plugins (now flash only)
         * @param       : {array } plugins, plugin list
         * @syntax      : detectPlugin(plugins)
         * @return      : {object} { 'flash' : 0|xx }
         */

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
                return toInt(v);
            }())
        };
    }
    function detectVersion (str) {
        /*
         * @description : detect versions
         * @param       : {string} userAgent, window.navigator.userAgent
         * @syntax      : detectVerion(userAgent)
         * @return      : {object} { 'flash' : 0|xx }
         */

        if (!str) {
            return;
        }
        str = pastry.lc(str);
        var ieVer,
            matched,
            versions = {};

        // browser versions {
            pastry.each([
                /msie ([\d.]+)/     ,
                /firefox\/([\d.]+)/ ,
                /chrome\/([\d.]+)/  ,
                /crios\/([\d.]+)/   ,
                /opera.([\d.]+)/    ,
                /adobeair\/([\d.]+)/
            ], function (reg) {
                setVer(versions, str, reg);
            });
        // }
        // chrome {
            if (versions.crios) {
                versions.chrome = versions.crios;
            }
        // }
        // safari {
            matched = str.match(/version\/([\d.]+).*safari/);
            if (matched) {
                setVerInt(versions, 'safari', matched[1] || 0);
            }
        // }
        // safari mobile {
            matched = str.match(/version\/([\d.]+).*mobile.*safari/);
            if (matched) {
                setVerInt(versions, 'mobilesafari', matched[1] || 0);
            }
        // }
        // engine versions {
            pastry.each([
                /trident\/([\d.]+)/     ,
                /gecko\/([\d.]+)/       ,
                /applewebkit\/([\d.]+)/ ,
                /presto\/([\d.]+)/
            ], function (reg) {
                setVer(versions, str, reg);
            });
            // IE {
                ieVer = versions.msie;
                if (ieVer === 6) {
                    versions.trident = 4;
                } else if (ieVer === 7 || ieVer === 8) {
                    versions.trident = 5;
                }
            // }
        // }
        return versions;
    }

    return {
        host      : location.host,
        platform  : detectPlatform(platform) || detectPlatform(userAgent) || 'unknown',
        plugins   : detectPlugin(plugins),
        userAgent : userAgent,
        versions  : detectVersion(userAgent)
    };
});

