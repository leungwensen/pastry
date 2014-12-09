/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/data', [
    'pastry',
    'dom/attr',
    'dom/utils',
    'dom/query'
], function(
    pastry,
    domAttr,
    domUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom dataSet related
     * @note        : if DataSet is supported, use DataSet
     */
    var dataSetStr = 'dataset',
        dataPrefix = 'data-',
        hasDataSet = domUtils.hasDataSet,
        domData;

    return pastry.domData = domData = {
        get: function (node, name) {
            node = domQuery.one(node);
            if (hasDataSet) {
                return node[dataSetStr][name];
            }
            return domAttr.get(node, dataPrefix + name);
        },
        set: function (node, name, value) {
            node = domQuery.one(node);
            if (hasDataSet) {
                node[dataSetStr][name] = value;
            } else {
                domAttr.set(node, dataPrefix + name, value);
            }
        }
    };
});

