/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/style', [
    'pastry',
    'bom/utils',
    'dom/utils',
    'dom/query'
], function(
    pastry,
    bomUtils,
    domUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom style
     */

    var getComputedStyle,
        toPixel,
        domStyle,
        getOpacity,
        setOpacity,
        queryOne    = domQuery.one,
        bomVersions = bomUtils.versions,
        ieVersion   = bomVersions.msie || 0,
        isQuirks    = domUtils.isQuirks,
        astr        = 'DXImageTransform.Microsoft.Alpha',
        RE_pixel    = /margin|padding|width|height|max|min|offset/, // |border
        pixelNamesCache = {
            left : true,
            top  : true
        },
        floatAlias = {
            cssFloat   : 1,
            styleFloat : 1,
            'float'    : 1
        };

    function af (n, f) {
        try{
            return n.filters.item(astr);
        }catch(e){
            return f ? {} : null;
        }
    }
    function toStyleValue (node, type, value) {
        type = pastry.lc(type);
        if (ieVersion || bomVersions.trident) {
            if (value === 'auto') {
                if (type === 'height') {
                    return node.offsetHeight;
                }
                if (type === 'width') {
                    return node.offsetWidth;
                }
            }
            if (type === 'fontweight') {
                switch(value){
                    case 700: return 'bold';
                    // case 400:
                    default: return 'normal';
                }
            }
        }
        if (!(type in pixelNamesCache)) {
            pixelNamesCache[type] = RE_pixel.test(type);
        }
        return pixelNamesCache[type] ? toPixel(node, value) : value;
    }

    if (ieVersion && (ieVersion < 9 || (ieVersion < 10 && isQuirks))) {
        getOpacity =  function (node) {
            try {
                return af(node).Opacity / 100; // Number
            } catch(e) {
                return 1; // Number
            }
        };
        setOpacity = function(/*DomNode*/ node, /*Number*/ opacity){
            if (opacity === '') {
                opacity = 1;
            }
            var ov = opacity * 100,
                fullyOpaque = opacity === 1;

            // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (bug #2661),
            // but still update the opacity value so we can get a correct reading if it is read later:
            // af(node, 1).Enabled = !fullyOpaque;
            if (fullyOpaque) {
                node.style.zoom = '';
                if(af(node)){
                    node.style.filter = node.style.filter.replace(
                        new RegExp('\\s*progid:' + astr + '\\([^\\)]+?\\)', 'i'), '');
                }
            } else {
                node.style.zoom = 1;
                if (af(node)) {
                    af(node, 1).Opacity = ov;
                } else {
                    node.style.filter += ' progid:' + astr + '(Opacity=' + ov + ')';
                }
                af(node, 1).Enabled = true;
            }

            if(node.tagName.toLowerCase() === 'tr'){
                for(var td = node.firstChild; td; td = td.nextSibling){
                    if(td.tagName.toLowerCase() === 'td'){
                        setOpacity(td, opacity);
                    }
                }
            }
            return opacity;
        };
    } else {
        getOpacity = function(node){
            return getComputedStyle(node).opacity;
        };
        setOpacity = function(node, opacity){
            return node.style.opacity = opacity;
        };
    }


    // getComputedStyle {
        if (bomUtils.isWebkit) {
            getComputedStyle = function (node) {
                var style;
                if (node.nodeType === 1) {
                    var dv = node.ownerDocument.defaultView;
                    style = dv.getComputedStyle(node, null);
                    if (!style && node.style) {
                        node.style.display = '';
                        style = dv.getComputedStyle(node, null);
                    }
                }
                return style || {};
            };
        } else if (ieVersion && ieVersion < 9 || isQuirks) {
            getComputedStyle = function (node) {
                return node.nodeType === 1 && node.currentStyle ? node.currentStyle : {};
            };
        } else {
            getComputedStyle = function (node) {
                return node.nodeType === 1 ?
                    node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
            };
        }
    // }
    // toPixel {
        if (ieVersion) {
            toPixel = function(element, avalue){
                if(!avalue){
                    return 0;
                }
                // on IE7, medium is usually 4 pixels
                if(avalue === 'medium'){
                    return 4;
                }
                // style values can be floats, client code may
                // want to round this value for integer pixels.
                if(avalue.slice && avalue.slice(-2) === 'px'){
                    return parseFloat(avalue);
                }
                var s = element.style,
                    rs = element.runtimeStyle,
                    cs = element.currentStyle,
                    sLeft = s.left,
                    rsLeft = rs.left;
                rs.left = cs.left;
                try{
                    // 'avalue' may be incompatible with style.left, which can cause IE to throw
                    // this has been observed for border widths using 'thin', 'medium', 'thick' constants
                    // those particular constants could be trapped by a lookup
                    // but perhaps there are more
                    s.left = avalue;
                    avalue = s.pixelLeft;
                }catch(e){
                    avalue = 0;
                }
                s.left = sLeft;
                rs.left = rsLeft;
                return avalue;
            };
        } else {
            toPixel = function(element, value){
                return parseFloat(value) || 0;
            };
        }
    // }

    return pastry.domStyle = domStyle = {
        getComputedStyle : getComputedStyle,
        toPixel          : toPixel,

        get: function (node, name) {
            var n  = queryOne(node),
                l  = arguments.length,
                op = (name === 'opacity'),
                style;
            if (l === 2 && op) {
                return getOpacity(n);
            }
            name  = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
            style = domStyle.getComputedStyle(n);
            return (l === 1) ? style : toStyleValue(n, name, style[name] || n.style[name]);
        },
        set: function (node, name, value) {
            var n  = queryOne(node),
                l  = arguments.length,
                op = (name === 'opacity');

            name = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
            if (l === 3) {
                return op ? setOpacity(n, value) : n.style[name] = value;
            }
            for (var x in name) {
                domStyle.set(node, x, name[x]);
            }
            return domStyle.getComputedStyle(n);
        }
    };
});

