/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/ui/Tree', [
    'pastry/pastry',
    'pastry/event',
    'pastry/oop/declare',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/data',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/ui/Component',
    'pastry/template/tree',
    'pastry/template/treeNode'
], function(
    pastry,
    event,
    declare,
    domClass,
    domConstruct,
    domData,
    domEvent,
    domQuery,
    domStyle,
    Component,
    templateWrapper,
    templateNode
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Tree
     */

    var NS      = '__tree__',
        NS_NODE = '__tree_node__',

        INDENT_LENGTH = 16, // indent for one level

        NODE_SELECTED_CLASS = 'selected',

        // icon {
            BRANCH_ICON_CLASS          = 'fa fa-folder',
            BRANCH_EXPANDED_ICON_CLASS = 'fa fa-folder-open',
            LEAF_ICON_CLASS            = 'fa fa-file',
        // }
        // expander {
            EXPANDER_ICON_CLASS          = 'fa fa-plus-square-o',
            EXPANDER_EXPANDED_ICON_CLASS = 'fa fa-minus-square-o',
            EXPANDER_TEXT                = '&blacktriangleright;',
            EXPANDER_EXPANDED_TEXT       = '&blacktriangledown;',
        // }
        // helpers {
            each    = pastry.each,
            every   = pastry.every,
            extend  = pastry.extend,
            hasKey  = pastry.hasKey,
            indexOf = pastry.indexOf,
            isArray = pastry.isArray,
            remove  = pastry.remove,
            uuid    = pastry.uuid,
        // }

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
                    if (node.tree.getLabel) {
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
                        if (node.tree.getIconClass) {
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
                        if (node.tree.getExpanderIconClass) {
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
                        if (node.tree.getExpanderText) {
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
        }),

        getTreeNodeFromDelegateEventAndTree = function (e, tree) {
            return tree.nodeById[domData.get(e.delegateTarget, 'id')];
        },

        Tree = declare('ui/Tree', [Component], {
            // constructor {
                constructor: function (option) {
                    option = option || {};
                    var tree = this,
                        container;

                    extend(tree, {
                        id           : uuid(NS),
                        data         : [],
                        nodes        : [],   // node instances
                        nodeById     : {},   // node instances by id
                        container    : null, // element
                        headElement  : null, // element
                        bodyElement  : null, // element
                        selectedNode : null, // selected node
                    }, option);
                    // render container {
                        if (option.container) {
                            tree.container = domQuery.one(option.container);
                        }
                        if (!tree.container) {
                            tree.container = domConstruct.toDom(templateWrapper(tree));
                        }
                        container = tree.container;
                    // }
                    // get other dom nodes {
                        if (tree.hasHead) {
                            tree.headElement = domQuery.one('thead', container);
                        }
                        tree.bodyElement = domQuery.one('tbody', container);
                    // }
                    // add nodes {
                        tree.addNodes(tree.data);
                        delete tree.data;
                    // }
                    // bind events {
                        // instance events {
                            event(tree); // add tree instance events
                            tree.on('node-clicked'     , function (node) { tree.onNodeClicked(node);     });
                            tree.on('node-collapsed'   , function (node) { tree.onNodeCollapsed(node);   });
                            tree.on('node-contextmenu' , function (node) { tree.onNodeContextmenu(node); });
                            tree.on('node-dblclicked'  , function (node) { tree.onNodeDblclicked(node);  });
                            tree.on('node-expanded'    , function (node) { tree.onNodeExpanded(node);    });
                            tree.on('node-selected'    , function (node) { tree.onNodeSelected(node);    });
                        // }
                        // dom events {
                            domEvent.on(container, 'click', '.tree-node-expander', function (e) {
                                getTreeNodeFromDelegateEventAndTree(e, tree).toggle();
                            });
                            domEvent.on(container, 'click', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.trigger('clicked');
                                tree.trigger('node-clicked', treeNode);
                            });
                            domEvent.on(container, 'contextmenu', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                e.preventDefault();
                                treeNode.trigger('contextmenu');
                                tree.trigger('node-contextmenu', treeNode);
                            });
                            domEvent.on(container, 'dblclick', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.trigger('dblclicked');
                                tree.trigger('node-dblclicked', treeNode);
                            });
                            domEvent.on(container, 'mousedown', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.select();
                                treeNode.trigger('selected');
                                tree.trigger('node-selected', treeNode);
                            });
                        // }
                    // }
                    return tree;
                },
            // }
            // attributes {
                hasHead        : false,
                treeColumnName : 'tree',
                extraColumns   : [], // extra columns
            // }
            // private methods {
                _processData: function (items) {
                    var tree = this;

                    // add id, extraColumns, tree, etc {
                        each(items, function (item) {
                            var id = item.id;
                            extend(item, {
                                extraColumns : tree.extraColumns,
                                tree         : tree,
                            });
                            if (typeof item.id === 'undefined') {
                                id = item.id = uuid(NS_NODE);
                            }
                            if (!tree.nodeById[id]) {
                                tree.nodeById[item.id] = item; // for counting length
                            }
                        });
                    // }
                    return tree;
                },
                _processNodes: function (nodes) {
                    /*
                     * @description: processing nodes
                     */
                    var tree = this,
                        parentId,
                        parent;

                    each(nodes, function (node) {
                        // add parent-child connections {
                            parent = node.getParent();
                            if (node.parentId !== null) {
                                if (parent) {
                                    node.parent = parent;
                                    parent.addChild(node);
                                } else {
                                    pastry.ERROR('node with id ' + parentId + ' does not exists');
                                }
                            }
                        // }
                    });
                    return tree;
                },
            // }
            // methods {
                addNodes: function (items) {
                    /*
                     * @description: add nodes
                     */
                    var tree  = this,
                        nodes = [];

                    items = items || [];
                    if (!isArray(items)) {
                        items = [items];
                    }
                    tree._processData(items);
                    // turn items into nodes {
                        each(items, function (item) {
                            var id = item.id,
                                node = tree.nodeById[id];
                            if (node instanceof TreeNode) {
                                return;
                            }
                            item = new TreeNode(item);
                            tree.nodes.push(item);
                            nodes.push(item);
                            tree.nodeById[item.id] = item;
                        });
                    // }
                    // process nodes {
                        tree._processNodes(nodes);
                    // }
                    // load nodes {
                        tree.eachNode(function (node) {
                            node.render(); // 必须和 load 分开做
                        });
                        tree.eachNode(function (node) {
                            node.load();
                        });
                    // }
                    return tree;
                },
                addNode: function (item) {
                    return this.addNodes([item]);
                },
                removeNodes: function (nodes) {
                    /*
                     * @description: remove nodes
                     */
                    var tree = this,
                        parent;
                    if (!isArray(nodes)) {
                        nodes = [nodes];
                    }
                    tree.eachNode(nodes, function (node) {
                        var treeNodeIndex = indexOf(tree.nodes, node);
                        if (treeNodeIndex > -1) {
                            remove(tree.nodes, treeNodeIndex);
                        }
                        delete tree.nodeById[node.id];
                        if (parent = node.parent) {
                            parent.removeChild(node);
                        }
                        node.eachChild(function (child) {
                            child.destroy();
                        });
                        node.destroy();
                    });
                    return tree;
                },
                queryNodes: function (query) {
                    /*
                     * @description: find nodes
                     */
                    var tree  = this;
                    if (isArray(query)) {
                        return query;
                    } else if (pastry.isPlainObject(query)) {
                        return pastry.filter(tree.nodes, function (node) {
                            return queryFilter(node, query);
                        });
                    }
                },
                eachNode: function (query, callback) {
                    /*
                     * @description: processing each node
                     */
                    var tree = this,
                        nodes = [];
                    if (!pastry.isFunction(query)) {
                        nodes = tree.queryNodes(query);
                    } else {
                        nodes = tree.nodes;
                        callback = query;
                    }
                    each(nodes, function (node) {
                        callback(node);
                    });
                    return tree;
                },
                expandNodes: function (/* node */) {
                },
            // }
            // events {
                onNodeClicked      : function (/* node */) { },
                onNodeContextmenu  : function (/* node */) { },
                onNodeDblclicked   : function (/* node */) { },
                onNodeExpanded     : function (/* node */) { },
                onNodeRightClicked : function (/* node */) { },
                onNodeSelected     : function (/* node */) { }
            // }
        });

    function queryFilter (target, queryObj) {
        return pastry.every(queryObj, function (value, key) {
            return target[key] === value;
        });
    }

    // Tree.render = function (/* container, option */) {
    // };

    Tree.Node = TreeNode;
    return Tree;
});

