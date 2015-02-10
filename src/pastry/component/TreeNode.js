/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/TreeNode', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/base/Component',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/base/event',
    'pastry/template/treeNode'
], function(
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domQuery,
    domStyle,
    event,
    templateNode
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : tree Node
     */
    var INDENT_LENGTH = 16, // indent for one level

        NODE_SELECTED_CLASS = 'selected',

        // icon {
            BRANCH_ICON_CLASS          = 'fa fa-folder',
            BRANCH_EXPANDED_ICON_CLASS = 'fa fa-folder-open',
            LEAF_ICON_CLASS            = 'fa fa-file',
        // }

        // expander {
            // EXPANDER_ICON_CLASS          = 'fa fa-arrow-right',
            // EXPANDER_EXPANDED_ICON_CLASS = 'fa fa-arrow-down',
            EXPANDER_ICON_CLASS          = 'fa fa-plus-square-o',
            EXPANDER_EXPANDED_ICON_CLASS = 'fa fa-minus-square-o',
            // EXPANDER_TEXT          = '&#9658;',
            // EXPANDER_EXPANDED_TEXT = '&#9660;',
            EXPANDER_TEXT          = '&blacktriangleright;',
            EXPANDER_EXPANDED_TEXT = '&blacktriangledown;',
        // }

        each    = pastry.each,
        every   = pastry.every,
        extend  = pastry.extend,
        hasKey  = pastry.hasKey,
        indexOf = pastry.indexOf,
        remove  = pastry.remove,

        TreeNode = declare('ui/tree/Node', [Component], {
            constructor: function (data) {
                if (data instanceof TreeNode) {
                    return data;
                }
                var node = this;
                // initialize private attributes {
                    extend(node, {
                        // attributes {
                            isRoot       : false , // 根节点
                            isBranch     : false , // 枝干节点
                            isLeaf       : true  , // 叶子节点
                            isExpanded   : true  , // expanded
                            isExpandable : false , // expandable
                            isSelected   : false , // selected
                            isChecked    : false , // checked
                            isFocused    : false , // focused
                            isLoaded     : false , // loaded
                        // }
                        // elements {
                            container       : null,
                            indenterElement : null,
                            expanderElement : null,
                            labelElement    : null,
                            iconElement     : null,
                        // }
                        // connections {
                            children : [],
                            parent   : null
                        // }
                    }, data);

                    each([
                        'hasIcon',
                        'hasExpanderIcon',
                        'hasCheckbox'
                    ], function (extraAttr) {
                        if (!hasKey(node, extraAttr)) {
                            node[extraAttr] = node.tree[extraAttr] || false;
                        }
                    });
                // }
                // bind events {
                    // instance events {
                        event(node); // add node instance events
                        node.on('clicked'     , function () { node.onClicked();     });
                        node.on('collapsed'   , function () { node.onCollapsed();   });
                        node.on('contextmenu' , function () { node.onContextmenu(); });
                        node.on('dblclicked'  , function () { node.onDblclicked();  });
                        node.on('expanded'    , function () { node.onExpanded();    });
                        node.on('selected'    , function () { node.onSelected();    });
                    // }
                    // dom events {
                    // }
                // }
                return node;
            },
            // attributes {
                id                : null  ,
                label             : null  , // label
                indent            : 0     , // indent of the node
                parentId          : null  ,
                iconClass         : null  ,
                expanderIconClass : null  ,
                expanderText      : null  ,
            // }
            // private methods {
                _setLabel: function () {
                    var node = this,
                        label;
                    if (node.getLabel) {
                        label = node.getLabel();
                    } else if (node.tree.getLabel) {
                        label = node.tree.getLabel(node);
                    } else {
                        // alias
                        label = node.label || node.name || '';
                    }
                    node.label = label;
                    if (node.labelElement) {
                        node.labelElement.innerHTML = label;
                    }
                    return node;
                },
                _setIconClass: function () {
                    var node = this,
                        iconClass;

                    if (node.hasIcon) {
                        if (node.getIconClass) {
                            iconClass = node.getIconClass();
                        } else if (node.tree.getIconClass) {
                            iconClass = node.tree.getIconClass(node);
                        } else {
                            if (node.isBranch) {
                                iconClass = node.isExpanded ?
                                    BRANCH_EXPANDED_ICON_CLASS : BRANCH_ICON_CLASS;
                            } else {
                                iconClass = LEAF_ICON_CLASS;
                            }
                        }
                        node.iconClass = iconClass;
                        if (node.iconElement) {
                            domClass.clear(node.iconElement);
                            domClass.add(node.iconElement, 'tree-node-icon ' + iconClass);
                        }
                    }
                    return node;
                },
                _setSelectedClass: function () {
                    var node = this,
                        container = node.container;
                    if (container) {
                        domClass[node.isSelected ? 'add' : 'remove'](container, NODE_SELECTED_CLASS);
                    }
                    return node;
                },
                _setExpanderIconClass: function () {
                    var node = this,
                        expanderIconClass;

                    if (node.isExpandable && node.hasExpanderIcon) {
                        if (node.getExpanderIconClass) {
                            expanderIconClass = node.getExpanderIconClass();
                        } else if (node.tree.getExpanderIconClass) {
                            expanderIconClass = node.tree.getExpanderIconClass(node);
                        } else {
                            expanderIconClass = node.isExpanded ?
                                EXPANDER_EXPANDED_ICON_CLASS : EXPANDER_ICON_CLASS;
                        }
                        node.expanderIconClass = expanderIconClass;
                        if (node.expanderElement) {
                            domClass.clear(node.expanderElement);
                            domClass.add(node.expanderElement, 'tree-node-expander ' + expanderIconClass);
                        }
                    }
                    return node;
                },
                _setExpanderText: function () {
                    var node = this,
                        expanderText;

                    if (node.isExpandable && !node.hasExpanderIcon) {
                        if (node.getExpanderText) {
                            expanderText = node.getExpanderText();
                        } else if (node.tree.getExpanderText) {
                            expanderText = node.tree.getExpanderText(node);
                        } else {
                            expanderText = node.isExpanded ?
                                EXPANDER_EXPANDED_TEXT : EXPANDER_TEXT;
                        }
                        node.expanderText = expanderText;
                        if (node.expanderElement) {
                            node.expanderElement.innerHTML = expanderText;
                        }
                    }
                    return node;
                },
                _setIndent: function () {
                    var node = this,
                        indent;

                    indent = INDENT_LENGTH * node.getLevel(); // 计算缩进
                    node.indent = indent;
                    if (node.indenterElement) {
                        domStyle.set(node.indenterElement, 'margin-left', indent + 'px');
                    }
                    return node;
                },
                _setLoaded: function () {
                    var node = this;

                    node.isLoaded = true;
                    node.eachChild(function (child) {
                        child.load();
                    });
                },
                _setSelected: function () {
                    var node = this,
                        tree = node.tree,
                        oldSelectedNode = tree.selectedNode;
                    node.isSelected = true;
                    if (oldSelectedNode) {
                        oldSelectedNode.isSelected = false;
                        oldSelectedNode._updateLayout();
                    }
                    tree.selectedNode = node;
                    return node._updateLayout();
                },
                _reload: function () {
                    var node = this;
                    node.eachChild(function (child) {
                        child.reload();
                    });
                },
                _updateLayout: function () {
                    return this
                        ._setLabel()
                        ._setIconClass()
                        ._setSelectedClass()
                        ._setExpanderIconClass()
                        ._setExpanderText()
                        ._setIndent();
                },
                _canMoveTo: function (target) {
                    var node = this;
                    if (
                        target.id === node.id || // 不能移动到自身
                        target.isLeaf || // 不能移动到叶子节点
                        indexOf(node.children, target) > -1 || // 不能移动到子节点
                        indexOf(target.getAncestors(), node) > -1 // 也不能移动到子孙节点
                    ) {
                        return false;
                    }
                    return true;
                },
                _isAncestorsExpanded: function () {
                    return every(this.getAncestors(), function (ancestor) {
                        return ancestor.isExpanded;
                    });
                },
            // }
            // methods {
                addChild: function (child) {
                    var node = this;
                    if (indexOf(node.children, child) === -1) {
                        node.children.push(child);
                    }
                    child.isRoot   = false;
                    child.parentId = node.id;
                    child.parent   = node;
                    if (child.isLoaded) {
                        child.reload();
                        if (child._isAncestorsExpanded()) {
                            child.show();
                        } else {
                            child.hide();
                        }
                    }
                    return node;
                },
                removeChild: function (child) {
                    var node = this,
                        index;
                    if ((index = indexOf(node.children, child)) !== -1) {
                        remove(node.children, index);
                        if (child.isLoaded && node.isExpanded) {
                            child.hide();
                        }
                    }
                    return node;
                },
                moveTo: function (target) {
                    /*
                     * @description: move to a target node
                     */
                    var node = this;
                    if (node._canMoveTo(target)) {
                        if (node.parent) {
                            node.parent.removeChild(node);
                        }
                        target.addChild(node);
                    }
                    return node;
                },
                eachChild: function (callback) {
                    /*
                     * @description: collapse the node
                     */
                    var node = this;
                    each(node.children, function (child) {
                        callback(child);
                    });
                    return node;
                },
                getParent: function () {
                    var node = this,
                        parentId = node.parentId;
                    if (node.parent) {
                        return node.parent;
                    }
                    if (typeof parentId !== 'undefined') {
                        return node.tree.nodeById[parentId];
                    }
                    return null;
                },
                getAncestors: function () {
                    var node = this,
                        ancestors = [];
                    while(node = node.getParent()) {
                        ancestors.push(node);
                    }
                    return ancestors;
                },
                getLevel: function () {
                    return this.getAncestors().length;
                },
                select: function () {
                    /*
                     * @description: set to be selected
                     */
                    return this._setSelected();
                },
                show: function () {
                    /*
                     * @description: show the node
                     */
                    var node = this;
                    Component.prototype.show.apply(node);
                    if (node.isExpanded) {
                        node.eachChild(function (child) {
                            child.show();
                        });
                    }
                    return node;
                },
                hide: function () {
                    /*
                     * @description: hide the node
                     */
                    var node = this;
                    Component.prototype.hide.apply(node);
                    if (node.isExpanded) {
                        node.eachChild(function (child) {
                            child.hide();
                        });
                    }
                    return node;
                },
                expand: function () {
                    /*
                     * @description: expand the node
                     */
                    var node = this;
                    node.isExpanded = true;
                    node.eachChild(function (child) {
                        child.show();
                    });
                    node._updateLayout();
                    node.trigger('expanded');
                    node.tree.trigger('node-expanded', node);
                    return node;
                },
                collapse: function () {
                    /*
                     * @description: collapse the node
                     */
                    var node = this;
                    node.isExpanded = false;
                    node.eachChild(function (child) {
                        child.hide();
                    });
                    return node._updateLayout();
                },
                toggle: function () {
                    /*
                     * @description: expand or collapse the node
                     */
                    var node = this;
                    return node.isExpanded ? node.collapse() : node.expand();
                },
                render: function () {
                    /*
                     * @description: render the node,
                     *      get attributes
                     *      get Elements
                     */
                    var node = this,
                        container;

                    // get attributes {
                        if (!node.parent) {
                            node.isRoot = true;
                        }
                        if (node.children.length) {
                            node.isBranch = true;
                            node.isLeaf = false;
                        }
                        node.isExpandable = node.isBranch;
                    // }
                    // get nodes {
                        container = node.container = node.container ||
                            domConstruct.toDom(templateNode(node, true)); // unescape
                        node.indenterElement = node.indenterElement ||
                            domQuery.one('.tree-node-indenter', container);
                        node.expanderElement = node.expanderElement ||
                            domQuery.one('.tree-node-expander', container);
                        node.labelElement = node.labelElement ||
                            domQuery.one('.tree-node-label', container);
                        node.iconElement = node.iconElement ||
                            domQuery.one('.tree-node-icon', container);
                    // }
                    node._updateLayout();
                    if (!node._isAncestorsExpanded()) {
                        node.hide();
                    }
                    return node;
                },
                load: function () {
                    /*
                     * @description: load the node to the tree;
                     */
                    var node = this;

                    if (!node.isLoaded) {
                        if (node.isRoot) {
                            node.placeAt(node.tree.bodyElement, 'first');
                            node._setLoaded();
                        } else if (node.parent.isLoaded) {
                            node.placeAt(node.parent.container, 'after');
                            node._setLoaded();
                        }
                    }
                    return node;
                },
                reload: function () {
                    var node = this;
                    if (!node.isLoaded) {
                        node.load();
                    } else {
                        node._updateLayout();
                        if (node.isRoot) {
                            node.placeAt(node.tree.bodyElement, 'first');
                            node._reload();
                        } else if (node.parent.isLoaded) {
                            node.placeAt(node.parent.container, 'after');
                            node._reload();
                        }
                    }
                    return node;
                },
                update: function (option) {
                    return extend(this, option).render();
                },
            // }
            // events {
                onClicked     : function () { },
                onCollapsed   : function () { },
                onContextmenu : function () { },
                onDblclicked  : function () { },
                onExpanded    : function () { },
                onSelected    : function () { },
                // onChecked     : function () { },
            // }
        });

    return TreeNode;
});

