/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/data', [
    'pastry',
    'dom/utils',
    'dom/query'
], function(
    pastry,
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
            return node[dataPrefix + name];
        },
        set: function (node, name, value) {
            node = domQuery.one(node);
            if (hasDataSet) {
                node[dataSetStr][name] = value;
            } else {
                node[dataPrefix + name] = value;
            }
        }
    };
});

