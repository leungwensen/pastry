/* jshint strict: true, undef: true */
/* global define */

define('template', [
    'pastry',
    'html/utils'
], function(
    pastry,
    htmlUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : template engine
     */
    var template,
        cache     = {},
        helper    = {},
        RE_parser = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
        // defaultOpitons = {}; // TODO add grammar aliases, etc.

    function render (s, p1, p2, p3, p4, p5) {
        if (p1) { // whitespace, quote and backspace in HTML context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === "=") {
                return "'+_e(typeof" + p3 + "==='undefined'?'':" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';";
        }
        if (p5) { // evaluation end tag: %}
            return "_s+='";
        }
    }

    // add helpers to pastry to pass to compiled functions, can be extended {
        // helper.escape = htmlUtils.escape;
        pastry.extend(helper, htmlUtils);
    // }

    return pastry.template = template = {
        helper: helper,
        compile: function (str/*, option*/) {
            // option = pastry.extend({}, defaultOpitons, option);
            if (!pastry.isString(str)) {
                return str;
            }

            /*jshint -W054*/ // new Function()
            return cache[str] || (cache[str] = new Function('obj', 'helper',
                    "var _e=helper.escape," +
                        "print=function(s,e){" +
                            "_s+=e?(s==null?'':s):_e(s);" +
                        "};" +
                    "with(obj){" +
                        // include helper {
                            // "include = function (s, d) {" +
                            //     "_s += tmpl(s, d);}" + "," +
                        // }
                        "_s='" + str.replace(RE_parser, render) + "';" +
                    "}" +
                    "return _s;"
                )
            );
        },
        render: function (str, data/*, option*/) {
            // option = option || {};
            // console.log(template.compile(str).toString());
            return template.compile(str/*, option*/)(data, template.helper);
        }
    };
});

