/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/construct', [
    'pastry',
    'bom/utils',
    // 'dom/attr',
    'dom/query'
], function(
    pastry,
    bomUtils,
    // domAttr,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom constructure related
     * @reference   : https://github.com/dojo/dojo/blob/master/dom-construct.js
     */
    var domConstruct,
        win      = window,
        doc      = document || win.document,
        queryOne = domQuery.one,
        tagWrap = {
            option   : ['select'],
            tbody    : ['table'],
            thead    : ['table'],
            tfoot    : ['table'],
            tr       : ['table', 'tbody'],
            td       : ['table', 'tbody', 'tr'],
            th       : ['table', 'thead', 'tr'],
            legend   : ['fieldset'],
            caption  : ['table'],
            colgroup : ['table'],
            col      : ['table', 'colgroup'],
            li       : ['ul']
        },
        RE_tag    = /<\s*([\w\:]+)/,
        masterDiv = doc.createElement('div');

    function insertBefore (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            parent.insertBefore(node, ref);
        }
    }
    function insertAfter (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            if (parent.lastChild === ref) {
                parent.appendChild(node);
            } else {
                parent.insertBefore(node, ref.nextSibling);
            }
        }
    }

    domConstruct = {
            toDom: function (frag, doc) {
                doc = doc;
                frag += '';

                var match  = frag.match(RE_tag),
                    tag    = match ? match[1].toLowerCase() : "",
                    wrap, i, fc, df;

                if (match && tagWrap[tag]) {
                    wrap = tagWrap[tag];
                    masterDiv.innerHTML = wrap.pre + frag + wrap.post;
                    for(i = wrap.length; i; --i){
                        masterDiv = masterDiv.firstChild;
                    }
                } else {
                    masterDiv.innerHTML = frag;
                }

                if (masterDiv.childNodes.length === 1) {
                    return masterDiv.removeChild(masterDiv.firstChild);
                }

                df = doc.createDocumentFragment();
                while ((fc = masterDiv.firstChild)) {
                    df.appendChild(fc);
                }
                return df;
            },
            place: function (node, refNode, position) {
                refNode = queryOne(refNode);
                if (pastry.isString(node)) {
                    node = /^\s*</.test(node) ? domConstruct.toDom(node, refNode.ownerDocument) : queryOne(node);
                }
                if (pastry.isNumber(position)) {
                    var childNodes = refNode.childNodes;
                    if (!childNodes.length || childNodes.length <= position) {
                        refNode.appendChild(node);
                    } else {
                        insertBefore(node, childNodes[position < 0 ? 0 : position]);
                    }
                } else {
                    switch (position) {
                        case 'before':
                            insertBefore(node, refNode);
                            break;
                        case 'after':
                            insertAfter(node, refNode);
                            break;
                        case 'replace':
                            refNode.parentNode.replaceChild(node, refNode);
                            break;
                        case 'only':
                            domConstruct.empty(refNode);
                            refNode.appendChild(node);
                            break;
                        case 'first':
                            if (refNode.firstChild) {
                                insertBefore(node, refNode.firstChild);
                            }
                            break;
                        default:
                            refNode.appendChild(node);
                    }
                }
            },
            create: function (/*DOMNode|String*/ tag, /*DOMNode|String?*/ refNode, /*String?*/ pos) {
                /*
                 * @reference: 和 dojo/dom-construct 的差别在于，为了去耦合，去除了 attr 相关的处理
                 */
                if (refNode) {
                    refNode = queryOne(refNode);
                    doc = refNode.ownerDocument;
                }
                if (pastry.isString(tag)) {
                    tag = doc.createElement(tag);
                }
                if (refNode) {
                    domConstruct.place(tag, refNode, pos);
                }
                return tag;
            },
            empty: function (node) {
                node = queryOne(node);
                if ('innerHTML' in node) {
                    try {
                        node.innerHTML = '';
                        return;
                    } catch(e) {
                    }
                }
                for (var c; c = node.lastChild;) {
                    node.removeChild(c);
                }
            },
            destroy: function (node) {
                node = queryOne(node);
                if (!node) {
                    return;
                }
                var parent = node.parentNode;
                if (node.firstChild) {
                    domConstruct.empty(node);
                }
                if (parent) {
                    if (bomUtils.isIE && parent.canHaveChildren && 'removeNode' in node) {
                        node.removeNode(false);
                    } else {
                        parent.removeChild(node);
                    }
                }
            }
        };

    return pastry.domConstruct = domConstruct;
});

