/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/query', [
    'pastry',
    'dom/utils'
], function(
    pastry,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : selector
     * @note        : browser only
     */
    var
        // 正则 {
            re_quick = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, // 应用快速选择器
        // }
        // 全局变量 {
            doc  = document,
            win  = window,
        // }
        // utils {
            toArray   = pastry.toArray,
            arrayLike = pastry.isArrayLike,
            isNode    = domUtils.isNode,
            contains  = domUtils.contains;
        // }

    function normalizeRoot (root) {
        if (!root) {
            return doc;
        }
        if (typeof root === 'string') {
            return query(root)[0];
        }
        if (!root['nodeType'] && arrayLike(root)) {
            return root[0];
        }
        return root;
    }
    function query (selector, optRoot) {
        var root = normalizeRoot(optRoot);

        if (!root || !selector) {
            return [];
        }
        if (selector === win || isNode(selector)) {
            return (!optRoot || (selector !== win && isNode(root) && contains(selector, root))) ?
                [selector] : [];
        }
        if (selector && arrayLike(selector)) {
            return pastry.flatten(selector);
        }

        if (pastry.isString(selector)) {
            var match = re_quick.exec(selector);

            if (match) {
                if (match[1]) {
                    return [root.getElementById(match[1])];
                } else if (match[2] ) {
                    return toArray(root.getElementsByTagName(match[2]));
                } else if (match[3]) {
                    return toArray(root.getElementsByClassName(match[3]));
                }
            }
        }
        if (selector && (selector.document || (selector.nodeType && selector.nodeType === 9))) {
            return !optRoot ? [selector] : [];
        }
        return toArray((root).querySelectorAll(selector));
    }

    return query;
});

