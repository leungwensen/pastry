/* jshint strict: true, undef: true, unused: true */
/* global define */

define('template', [
    'pastry'
    // 'dom/construct'
], function(
    pastry
    // domConstruct
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : template engine
     */
    var template,
        cache = {};
        // defaultOpitons = {}; // TODO add grammar aliases, etc.

    return pastry.template = template = {
        compile: function (str/*, option*/) {
            // option = pastry.extend({}, defaultOpitons, option);
            if (!pastry.isString(str)) {
                return str;
            }
            /*jshint -W054*/
            return cache[str] || (cache[str] = new Function('obj',
                    'var p = [],' +
                        'print = function(){' +
                            'p.push.apply(p, arguments);' +
                        '};' +
                    // Introduce the data as local variables using with(){}
                    'with(obj){' +
                        'p.push("' +
                            // Convert the template into pure JavaScript
                            // (function () { // tobe extended
                                str
                                    .replace(/[\r\t\n]/g, ' ')
                                    .split("<%").join('\t')
                                    .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                                    .replace(/\t=(.*?)%>/g, "',$1,'")
                                    .split('\t').join("');")
                                    .split('%>').join("p.push('")
                                    .split('\r').join("\\'") +
                                    // .split('\r').join("\\'");
                                // return str;
                            // }()) +
                        '");' +
                    '};' +
                    'return p.join("");'
                )
            );
        },
        render: function (str, data/*, option*/) {
            // option = option || {};
            return template.compile(str/*, option*/)(data);
        }
    };
});

